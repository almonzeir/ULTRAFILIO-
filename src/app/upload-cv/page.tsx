'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Define UploadMeta type based on the prompt
interface UploadMeta {
  cvFileUrl: string;
  cvFileType: 'pdf' | 'doc' | 'docx';
  profilePhotoURL?: string;
  fileSizeBytes: number;
}

export default function UploadCVPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = useState<UploadMeta | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load persisted state from localStorage on component mount
    const storedUploadMeta = localStorage.getItem('uploadMeta');
    const storedProfilePhotoURL = localStorage.getItem('profilePhotoURL');

    if (storedUploadMeta) {
      setUploadMeta(JSON.parse(storedUploadMeta));
    }
    if (storedProfilePhotoURL) {
      setProfilePhotoURL(storedProfilePhotoURL);
    }
  }, []);

  const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (!fileType || !['pdf', 'doc', 'docx'].includes(fileType)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF, DOC, or DOCX file for your CV.',
          variant: 'destructive',
        });
        setCvFile(null);
        return;
      }
      setCvFile(file);
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (!cvFile) {
      toast({
        title: 'CV Required',
        description: 'Please upload your CV to continue.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate file upload and get temporary URLs
    // In a real application, you would upload to a storage service (e.g., Firebase Storage, S3)
    // and get a public URL or a storage key.
    const tempCvFileUrl = URL.createObjectURL(cvFile);
    const tempProfilePhotoURL = profilePhoto ? URL.createObjectURL(profilePhoto) : undefined;

    const newUploadMeta: UploadMeta = {
      cvFileUrl: tempCvFileUrl,
      cvFileType: cvFile.name.split('.').pop() as 'pdf' | 'doc' | 'docx',
      fileSizeBytes: cvFile.size,
      profilePhotoURL: tempProfilePhotoURL,
    };

    setUploadMeta(newUploadMeta);
    setProfilePhotoURL(tempProfilePhotoURL);

    // Persist to localStorage
    localStorage.setItem('uploadMeta', JSON.stringify(newUploadMeta));
    if (tempProfilePhotoURL) {
      localStorage.setItem('profilePhotoURL', tempProfilePhotoURL);
    } else {
      localStorage.removeItem('profilePhotoURL');
    }

    toast({
      title: 'Upload Successful',
      description: 'Your CV and photo have been prepared for template selection.',
    });

    // Navigate to Templates Gallery Page
    router.push('/choose-template');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upload Your CV & Photo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cv">Curriculum Vitae (PDF, DOC, DOCX)</Label>
            <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvFileChange} />
            {cvFile && <p className="text-sm text-gray-500">Selected CV: {cvFile.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photo">Profile Photo (Optional)</Label>
            <Input id="photo" type="file" accept="image/*" onChange={handleProfilePhotoChange} />
            {profilePhoto && <p className="text-sm text-gray-500">Selected Photo: {profilePhoto.name}</p>}
          </div>
          <Button type="submit" className="w-full" onClick={handleContinue}>
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
