'use client';

import * as React from 'react';
import { UploadCloud, Camera, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UploadCVCardProps {
  onContinue: (cvFile: File, photoFile: File | null) => Promise<void>;
  isProcessing: boolean;
  dict: Dictionary['createPage']['uploadCard'];
}

export default function UploadCVCard({ onContinue, isProcessing, dict }: UploadCVCardProps) {
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const cvFileInputRef = React.useRef<HTMLInputElement>(null);
  const photoFileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File | null, fileType: 'cv' | 'photo') => {
    if (!file) return;

    const maxSize = fileType === 'cv' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    const acceptedTypes = fileType === 'cv'
      ? ['application/pdf']
      : ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Please select a file smaller than ${maxSize / 1024 / 1024}MB.`
      });
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: fileType === 'cv'
          ? 'Please upload a PDF file.'
          : 'Please upload a JPG, PNG, or WebP file.'
      });
      return;
    }

    if (fileType === 'cv') {
      setCvFile(file);
    } else {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'photo') => {
    handleFile(event.target.files?.[0] || null, fileType);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      handleFile(file, 'cv');
    }
  };

  const handleDropAreaClick = () => {
    cvFileInputRef.current?.click();
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  };

  const handleContinueClick = () => {
    if (cvFile) {
      onContinue(cvFile, photoFile);
    } else {
      toast({
        variant: 'destructive',
        title: 'CV Required',
        description: 'Please upload your CV to continue.',
      });
    }
  };

  return (
    <div
      className="h-full flex flex-col p-8 md:p-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="mb-6">
        <motion.h2
          className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {dict.title}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {dict.description}
        </motion.p>
      </div>

      {/* Avatar Upload - Circular Badge Style */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="file"
          ref={photoFileInputRef}
          onChange={(e) => handleFileChange(e, 'photo')}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <button
          type="button"
          onClick={() => photoFileInputRef.current?.click()}
          className="relative group"
        >
          <div className={cn(
            "w-16 h-16 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-muted/50",
            photoPreview
              ? "border-primary"
              : "border-muted-foreground/30 hover:border-primary group-hover:scale-105"
          )}>
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          {photoFile && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 bg-destructive rounded-full p-1 hover:bg-destructive/80 transition-colors shadow-lg"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{dict.photoLabel}</p>
          <p className="text-xs text-muted-foreground">Optional</p>
        </div>
      </motion.div>

      {/* Cinematic Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1"
      >
        <input
          type="file"
          ref={cvFileInputRef}
          onChange={(e) => handleFileChange(e, 'cv')}
          className="hidden"
          accept="application/pdf"
        />
        <div
          onClick={handleDropAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative h-full min-h-[200px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group border-2 border-dashed",
            isDragging
              ? "bg-primary/10 border-primary scale-[1.02]"
              : cvFile
                ? "bg-primary/5 border-primary"
                : "bg-muted/30 border-muted-foreground/30 hover:border-primary hover:bg-muted/50"
          )}
        >
          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              animate={isDragging ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <UploadCloud className={cn(
                "w-12 h-12 mx-auto mb-4 transition-colors duration-300",
                isDragging || cvFile ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
            </motion.div>

            {cvFile ? (
              <div>
                <p className="text-lg font-bold text-foreground mb-1">{cvFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {dict.dropzone.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dict.dropzone.hint}
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.button
        onClick={handleContinueClick}
        disabled={!cvFile || isProcessing}
        className={cn(
          "mt-6 w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300",
          cvFile
            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
        whileHover={cvFile ? { scale: 1.02 } : {}}
        whileTap={cvFile ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" />
            {dict.processingButton}
          </>
        ) : (
          <>
            {dict.continueButton}
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </div>
  );
}