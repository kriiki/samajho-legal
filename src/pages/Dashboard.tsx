import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageCircle, Scale, FileText, Mic, User, LogOut, Globe } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { InteractiveQA } from "@/components/InteractiveQA";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";

interface DashboardProps {
  userData: any;
  onLogout: () => void;
}

export const Dashboard = ({ userData, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'qa' | 'analysis'>('home');
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);

  const handleDocumentUpload = (file: File) => {
    setUploadedDocument(file);
    setCurrentView('analysis');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setUploadedDocument(null);
  };

  if (currentView === 'upload') {
    return <DocumentUpload onDocumentUpload={handleDocumentUpload} onBack={handleBackToHome} />;
  }

  if (currentView === 'qa') {
    return <InteractiveQA userData={userData} onBack={handleBackToHome} />;
  }

  if (currentView === 'analysis' && uploadedDocument) {
    return <DocumentAnalysis document={uploadedDocument} userData={userData} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary border-b border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary-foreground mr-3" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">LegalAI</h1>
                <p className="text-xs text-primary-foreground/70">Legal Document Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{userData.preferredLanguage?.toUpperCase() || 'EN'}</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{userData.name || 'User'}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">
            Welcome back, {userData.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-primary-foreground/70">
            Get AI-powered assistance for your legal documents and questions.
          </p>
        </div>

        {/* Main Options */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Document Upload Card */}
          <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => setCurrentView('upload')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-lg">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>Upload and analyze legal documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-muted-foreground mb-4">
                Upload your legal documents (PDF, JPG) to get instant analysis, risk assessment, and multilingual explanations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-safe-bg text-safe text-xs rounded-full">✓ Risk Analysis</span>
                <span className="px-2 py-1 bg-warning-bg text-warning text-xs rounded-full">⚠ Clause Highlighting</span>
                <span className="px-2 py-1 bg-neutral-bg text-neutral text-xs rounded-full">🌐 Multi-language</span>
              </div>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>

          {/* Interactive Q&A Card */}
          <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => setCurrentView('qa')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-lg">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Interactive Q&A</CardTitle>
                  <CardDescription>Ask legal questions directly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-muted-foreground mb-4">
                Get instant answers to your legal questions with AI assistance. Available in text and voice formats.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-safe-bg text-safe text-xs rounded-full">💬 Text Chat</span>
                <span className="px-2 py-1 bg-warning-bg text-warning text-xs rounded-full">🎤 Voice Support</span>
                <span className="px-2 py-1 bg-neutral-bg text-neutral text-xs rounded-full">📚 Indian Law</span>
              </div>
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Q&A Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Smart Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-sm text-muted-foreground">
                Advanced AI analyzes legal documents for risks, implications, and next steps specific to Indian law.
              </p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Voice Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-sm text-muted-foreground">
                Interact with our AI assistant through voice commands in multiple Indian languages.
              </p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Multi-language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-sm text-muted-foreground">
                Get explanations and analysis in your preferred Indian language for better understanding.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <div className="legal-disclaimer mt-8 p-4 bg-card rounded-lg border">
          <p className="text-center">
            <strong>Important:</strong> This AI assistant provides information and analysis for educational purposes only. 
            It does not constitute legal advice. For specific legal matters, please consult with a qualified legal professional. 
            All document uploads are encrypted and securely processed in compliance with Indian data protection laws.
          </p>
        </div>
      </main>
    </div>
  );
};