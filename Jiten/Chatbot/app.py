from flask import Flask, request, jsonify
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, trim_messages
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import uuid
from typing import Dict, List, Optional
import os 

app = Flask(__name__)
os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")  # Set your Google API key here
# Initialize Google Gemini model with system instructions in the model config
# Note: Gemini models handle system messages differently than other LLMs
model = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # Pass the system message here instead of in the chat history
    system_instruction="You are a helpful assistant. Answer all the questions to the best of your ability.",
)

# Create prompt template without the system message (will be handled by model config)
prompt = ChatPromptTemplate.from_messages(
    [MessagesPlaceholder(variable_name="messages")]
)

# Create the chain
chain = prompt | model

# Create our own simple message history class
class SimpleMessageHistory(BaseChatMessageHistory):
    def __init__(self):
        self.messages = []
    
    def add_message(self, message):
        self.messages.append(message)
    
    def clear(self):
        self.messages = []

# Message trimmer configuration 
# Note: We exclude system messages since they're handled by the model config
trimmer = trim_messages(
    max_tokens=150,
    strategy="last",
    token_counter=model,
    include_system=False,  # Changed to False since system message is in model config
    allow_partial=False,
    start_on="human"
)

# Storage for message histories
store: Dict[str, SimpleMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create a message history for a session ID."""
    if session_id not in store:
        store[session_id] = SimpleMessageHistory()
    return store[session_id]

# Configure the model with message history
with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="messages"
)

def trim_history(session_id: str) -> None:
    """Trim message history using LangChain's trim_messages function."""
    if session_id not in store:
        return
    
    history = store[session_id]
    messages = history.messages
    
    # Filter out any system messages before trimming
    messages = [msg for msg in messages if not isinstance(msg, SystemMessage)]
    
    # Apply trimming
    trimmed_messages = trimmer.invoke(messages)
    
    # Update the store with trimmed messages
    store[session_id].messages = trimmed_messages

@app.route('/chat/init', methods=['GET'])
def initialize_session():
    """Initialize a new chat session."""
    session_id = str(uuid.uuid4())
    history = get_session_history(session_id)
    
    # Add initial AI message (no system message in history)
    initial_message = "Hi! How may I help you?"
    history.add_message(AIMessage(content=initial_message))
    
    return jsonify({
        "session_id": session_id,
        "message": initial_message
    })

@app.route('/chat/message', methods=['POST'])
def handle_message():
    """Process a user message and return a response."""
    data = request.json
    
    session_id = data.get('session_id')
    if not session_id or session_id not in store:
        return jsonify({"error": "Invalid or expired session ID"}), 400
    
    user_message = data.get('message', '')
    language = data.get('language', 'English')
    
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400
    
    # Add user message to history
    history = get_session_history(session_id)
    history.add_message(HumanMessage(content=user_message))
    
    # Trim history before processing
    trim_history(session_id)
    
    # Update system instruction with language preference if specified
    if language != "English":
        # Create a temporary model with language-specific system instruction
        temp_model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-001",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            system_instruction=f"You are a helpful assistant. Answer all the questions to the best of your ability in the {language} language.",
        )
        temp_chain = prompt | temp_model
        
        # Create temporary RunnableWithMessageHistory
        temp_with_message_history = RunnableWithMessageHistory(
            temp_chain,
            get_session_history,
            input_messages_key="messages"
        )
        
        # Process the message with the temporary model
        response = temp_with_message_history.invoke(
            {"messages": [HumanMessage(content=user_message)]},
            config={"configurable": {"session_id": session_id}}
        )
    else:
        # Process the message with the default model
        response = with_message_history.invoke(
            {"messages": [HumanMessage(content=user_message)]},
            config={"configurable": {"session_id": session_id}}
        )
    
    return jsonify({
        "session_id": session_id,
        "message": response.content
    })

@app.route('/chat/history', methods=['GET'])
def get_history():
    """Get the message history for a session."""
    session_id = request.args.get('session_id')
    if not session_id or session_id not in store:
        return jsonify({"error": "Invalid or expired session ID"}), 400
    
    history = get_session_history(session_id)
    messages = [{"role": "system" if isinstance(msg, SystemMessage) else 
                       "human" if isinstance(msg, HumanMessage) else "ai", 
                "content": msg.content} 
               for msg in history.messages]
    
    return jsonify({
        "session_id": session_id,
        "history": messages
    })

if __name__ == '__main__':
    app.run(debug=True)