
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, Video, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const QuickReportForm: React.FC = () => {
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'audio' | 'video' | null>(null);
  
  // References for media capture
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType) {
      toast.error("Please select an incident type");
      return;
    }
    
    if (!description && !mediaPreview) {
      toast.error("Please provide either a description or media evidence");
      return;
    }
    
    toast.success("Quick report submitted successfully!");
    // Reset form
    setReportType('');
    setDescription('');
    setMediaPreview(null);
    setMediaType(null);
  };
  
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        setTimeout(() => {
          if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            setMediaPreview(dataUrl);
            setMediaType('photo');
            
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
            
            toast.success("Photo captured!");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };
  
  const handleAudioRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.info("Audio recording stopped");
      }
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(mediaChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaPreview(audioUrl);
        setMediaType('audio');
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started... Press again to stop.");
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };
  
  const handleVideoRecording = async () => {
    if (isVideoRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsVideoRecording(false);
        toast.info("Video recording stopped");
      }
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setMediaPreview(videoUrl);
        setMediaType('video');
        
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      
      mediaRecorder.start();
      setIsVideoRecording(true);
      toast.success("Video recording started... Press again to stop.");
      
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
      toast.error("Could not access camera or microphone. Please check permissions.");
    }
  };

  const reportTypes = [
    { id: 'theft', label: 'Theft' },
    { id: 'accident', label: 'Accident' },
    { id: 'suspicious', label: 'Suspicious' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'violence', label: 'Violence' },
    { id: 'vandalism', label: 'Vandalism' },
    { id: 'fire', label: 'Fire' },
    { id: 'medical', label: 'Medical Emergency' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Incident Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {reportTypes.map((type) => (
            <Button
              key={type.id}
              type="button"
              variant={reportType === type.id ? "default" : "outline"}
              className={`text-xs ${reportType === type.id ? "bg-raksha-primary" : ""}`}
              onClick={() => setReportType(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Description</h3>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe the incident..."
          rows={2}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Add Evidence</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="h-14 flex flex-col items-center justify-center"
            onClick={handleTakePhoto}
          >
            <Camera size={18} />
            <span className="text-xs mt-1">Photo</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className={`h-14 flex flex-col items-center justify-center ${isRecording ? 'border-raksha-primary text-raksha-primary' : ''}`}
            onClick={handleAudioRecording}
          >
            <Mic size={18} className={isRecording ? "animate-pulse text-raksha-primary" : ""} />
            <span className="text-xs mt-1">{isRecording ? "Stop" : "Voice"}</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className={`h-14 flex flex-col items-center justify-center ${isVideoRecording ? 'border-raksha-primary text-raksha-primary' : ''}`}
            onClick={handleVideoRecording}
          >
            <Video size={18} className={isVideoRecording ? "animate-pulse text-raksha-primary" : ""} />
            <span className="text-xs mt-1">{isVideoRecording ? "Stop" : "Video"}</span>
          </Button>
        </div>

        {mediaPreview && (
          <div className="mt-4 border border-gray-200 rounded-lg p-3">
            {mediaType === 'photo' && (
              <img src={mediaPreview} alt="Captured" className="w-full max-h-32 object-contain rounded" />
            )}
            
            {mediaType === 'audio' && (
              <audio ref={audioRef} src={mediaPreview} controls className="w-full" />
            )}
            
            {mediaType === 'video' && (
              <video ref={videoRef} src={mediaPreview} controls className="w-full max-h-32" />
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                setMediaPreview(null);
                setMediaType(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}

        {/* Hidden video element for camera functionality */}
        <video ref={videoRef} style={{ display: 'none' }} muted />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-raksha-primary hover:bg-raksha-primary/90"
      >
        <AlertTriangle size={16} className="mr-2" />
        Submit Quick Report
      </Button>
    </form>
  );
};

export default QuickReportForm;
