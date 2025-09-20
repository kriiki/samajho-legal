import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MessageCircle, 
  Globe, 
  UserCheck,
  ClipboardList,
  Lightbulb,
  Scale
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentAnalysisProps {
  document: File;
  userData: any;
  onBack: () => void;
}

interface Clause {
  id: string;
  text: string;
  category: 'safe' | 'warning' | 'risk' | 'neutral';
  explanation: string;
  lawReference?: string;
  recommendations?: string[];
}

interface AnalysisResult {
  summary: string;
  overallRisk: 'low' | 'medium' | 'high';
  clauses: Clause[];
  nextSteps: string[];
  negotiationPoints: string[];
  humanReviewRequired: boolean;
}

export const DocumentAnalysis = ({ document, userData, onBack }: DocumentAnalysisProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(userData.preferredLanguage || 'en');
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' }
  ];

  // Simulate document analysis
  useEffect(() => {
    const simulateAnalysis = () => {
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          summary: "This is a rental agreement with standard terms. Several clauses require attention, particularly regarding security deposit and termination conditions. Some risk factors have been identified that may require negotiation or legal review.",
          overallRisk: 'medium',
          clauses: [
            {
              id: '1',
              text: "The tenant shall pay a security deposit equivalent to 3 months' rent upon signing this agreement.",
              category: 'safe',
              explanation: "This is a standard security deposit clause commonly found in Indian rental agreements. The amount is reasonable and within legal limits.",
              lawReference: "The Rent Control Act allows landlords to collect security deposit up to 10 months' rent in most states.",
              recommendations: ["Ensure deposit refund conditions are clearly mentioned", "Get receipt for security deposit payment"]
            },
            {
              id: '2', 
              text: "The landlord reserves the right to terminate this agreement with 15 days notice for any reason.",
              category: 'warning',
              explanation: "This clause gives significant power to the landlord and may not provide adequate protection to the tenant.",
              lawReference: "Most state rent control laws require 30-90 days notice period for termination without cause.",
              recommendations: ["Negotiate for longer notice period", "Add conditions for valid reasons for termination", "Seek legal advice if disputed"]
            },
            {
              id: '3',
              text: "Any damage to the property, regardless of cause, shall be fully compensated by the tenant including natural wear and tear.",
              category: 'risk',
              explanation: "This clause is potentially unfair and may not be legally enforceable. Normal wear and tear should not be tenant's responsibility.",
              lawReference: "Indian Contract Act and various state tenancy laws protect tenants from liability for normal wear and tear.",
              recommendations: ["Strongly negotiate to remove this clause", "Demand property condition documentation", "Consider legal consultation"]
            },
            {
              id: '4',
              text: "The monthly rent is ₹25,000 and shall be paid by the 5th of each month.",
              category: 'neutral',
              explanation: "Standard rent payment clause with clear amount and due date specified.",
              lawReference: "Payment terms should be clearly defined as per Indian Contract Act.",
              recommendations: ["Ensure you understand late payment penalties", "Keep payment records"]
            }
          ],
          nextSteps: [
            "Review and negotiate the termination clause for better tenant protection",
            "Demand removal or modification of the unfair damage liability clause", 
            "Ensure all utility and maintenance responsibilities are clearly defined",
            "Get legal review before signing, especially for high-risk clauses",
            "Document property condition with photos before moving in"
          ],
          negotiationPoints: [
            "Extend notice period for termination from 15 to 30+ days",
            "Limit damage liability to exclude normal wear and tear",
            "Add clause for landlord's maintenance responsibilities",
            "Include rent escalation limits and conditions",
            "Specify conditions for security deposit refund"
          ],
          humanReviewRequired: true
        };

        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Your document has been analyzed. Review the results and recommendations.",
        });
      }, 3000);
    };

    simulateAnalysis();
  }, [document, toast]);

  const handleClauseClick = (clause: Clause) => {
    setSelectedClause(clause);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', content: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "Based on your document analysis, I can help explain this further. This relates to the clauses we've identified and the applicable Indian laws. Would you like me to elaborate on any specific aspect?" 
      }]);
    }, 1000);
    
    setChatInput('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safe': return 'border-l-safe bg-safe-bg text-safe-foreground';
      case 'warning': return 'border-l-warning bg-warning-bg text-warning-foreground';
      case 'risk': return 'border-l-risk bg-risk-bg text-risk-foreground';
      default: return 'border-l-neutral bg-neutral-bg text-neutral-foreground';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-safe-bg text-safe border-safe';
      case 'medium': return 'bg-warning-bg text-warning border-warning';
      case 'high': return 'bg-risk-bg text-risk border-risk';
      default: return 'bg-neutral-bg text-neutral border-neutral';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Scale className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <CardTitle>Analyzing Document</CardTitle>
            <CardDescription>
              AI is processing your document...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex justify-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="body-text text-sm text-muted-foreground">
                • Extracting text and clauses<br/>
                • Analyzing legal implications<br/>
                • Assessing risk factors<br/>
                • Generating recommendations
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary border-b border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-primary-foreground hover:bg-primary-foreground/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary-foreground mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-primary-foreground">{document.name}</h1>
                  <p className="text-xs text-primary-foreground/70">Legal Analysis Results</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40 text-primary-foreground border-primary-foreground/30">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Badge className={getRiskBadgeColor(analysisResult.overallRisk)}>
                Risk: {analysisResult.overallRisk.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Document Summary</CardTitle>
                <CardDescription>AI-powered analysis of your legal document</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="body-text">{analysisResult.summary}</p>
                {analysisResult.humanReviewRequired && (
                  <div className="mt-4 p-4 bg-risk-bg rounded-lg border-l-4 border-risk">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-4 w-4 text-risk" />
                      <span className="font-medium text-risk">Human Review Recommended</span>
                    </div>
                    <p className="body-text text-sm">
                      This document contains high-risk clauses that should be reviewed by a qualified legal professional.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Connect with Lawyer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clauses Analysis */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Clause-by-Clause Analysis</CardTitle>
                <CardDescription>Click on any clause to view detailed explanation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.clauses.map((clause) => (
                    <div
                      key={clause.id}
                      className={`p-4 border-l-4 rounded-r-lg cursor-pointer transition-all hover:shadow-md ${getCategoryColor(clause.category)}`}
                      onClick={() => handleClauseClick(clause)}
                    >
                      <div className="flex items-start gap-3">
                        {getCategoryIcon(clause.category)}
                        <div className="flex-1">
                          <p className="body-text font-medium mb-2">{clause.text}</p>
                          <p className="body-text text-sm opacity-80">{clause.explanation}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {clause.category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Recommendations & Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="next-steps">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
                    <TabsTrigger value="negotiation">Negotiation Points</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="next-steps" className="space-y-3 mt-4">
                    {analysisResult.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <ClipboardList className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        <p className="body-text">{step}</p>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="negotiation" className="space-y-3 mt-4">
                    {analysisResult.negotiationPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        <p className="body-text">{point}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Clause Details */}
            {selectedClause && (
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Clause Details</CardTitle>
                  <CardDescription>Legal analysis and references</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Explanation</h4>
                    <p className="body-text text-sm">{selectedClause.explanation}</p>
                  </div>
                  
                  {selectedClause.lawReference && (
                    <div>
                      <h4 className="font-medium mb-2">Legal Reference</h4>
                      <p className="body-text text-sm text-muted-foreground">{selectedClause.lawReference}</p>
                    </div>
                  )}
                  
                  {selectedClause.recommendations && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {selectedClause.recommendations.map((rec, index) => (
                          <li key={index} className="body-text text-sm flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Assistant Chat */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Ask questions about your document</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 mb-4">
                  <div className="space-y-3">
                    {chatMessages.length === 0 && (
                      <p className="body-text text-sm text-muted-foreground text-center py-4">
                        Ask me anything about your document analysis...
                      </p>
                    )}
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`p-2 rounded ${msg.type === 'user' ? 'bg-primary text-primary-foreground ml-4' : 'bg-muted mr-4'}`}>
                        <p className="body-text text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your document..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  />
                  <Button size="sm" onClick={handleChatSend}>
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Legal Disclaimer */}
            <Card className="card-shadow border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="legal-disclaimer">
                  This AI analysis is for informational purposes only and does not constitute legal advice. 
                  Always consult with a qualified attorney for legal matters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};