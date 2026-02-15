import { useState } from 'react';
import { useLogSMS, useGetAllStudents } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SMSLog } from '../../backend';
import { Link } from '@tanstack/react-router';
import { History, Send } from 'lucide-react';
import { SMS_TEMPLATES, insertTemplate } from '../../components/sms/SMSTemplates';

export default function SMSPage() {
  const logSMS = useLogSMS();
  const { data: students = [] } = useGetAllStudents();
  const [message, setMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleSendIndividual = async () => {
    if (!selectedStudent || !message) {
      toast.error('Please select a student and enter a message');
      return;
    }

    const student = students.find(s => s.systemId === selectedStudent);
    if (!student) return;

    try {
      const log: SMSLog = {
        systemId: `SMS${Date.now()}`,
        receiver: student.parentPhone,
        message,
        timestamp: BigInt(Date.now() * 1000000),
        deliveryStatus: 'Simulated - Sent',
      };

      await logSMS.mutateAsync(log);
      toast.success('SMS sent successfully (simulated)');
      setMessage('');
      setSelectedStudent('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send SMS');
    }
  };

  const handleSendBulk = async () => {
    if (!selectedGroup || !message) {
      toast.error('Please select a group and enter a message');
      return;
    }

    try {
      const log: SMSLog = {
        systemId: `SMS${Date.now()}`,
        receiver: `Group: ${selectedGroup}`,
        message,
        timestamp: BigInt(Date.now() * 1000000),
        deliveryStatus: 'Simulated - Sent to Group',
      };

      await logSMS.mutateAsync(log);
      toast.success(`Bulk SMS sent to ${selectedGroup} (simulated)`);
      setMessage('');
      setSelectedGroup('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send bulk SMS');
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setMessage(SMS_TEMPLATES[template as keyof typeof SMS_TEMPLATES]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SMS Notifications</h1>
        <Link to="/sms/history">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send SMS (Simulated)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" className="space-y-4">
            <TabsList>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="bulk">Bulk</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.systemId} value={student.systemId}>
                        {student.firstName} {student.lastName} - {student.parentPhone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feePayment">Fee Payment Confirmation</SelectItem>
                    <SelectItem value="feeReminder">Fee Reminder</SelectItem>
                    <SelectItem value="examResult">Exam Result Notification</SelectItem>
                    <SelectItem value="announcement">General Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={5}
                />
              </div>

              <Button onClick={handleSendIndividual} disabled={logSMS.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {logSMS.isPending ? 'Sending...' : 'Send SMS (Simulated)'}
              </Button>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group">Select Group</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Parents">All Parents</SelectItem>
                    <SelectItem value="Outstanding Fees">Students with Outstanding Fees</SelectItem>
                    {Array.from(new Set(students.map(s => s.className))).map(className => (
                      <SelectItem key={className} value={`Class: ${className}`}>
                        Class: {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-bulk">Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feePayment">Fee Payment Confirmation</SelectItem>
                    <SelectItem value="feeReminder">Fee Reminder</SelectItem>
                    <SelectItem value="examResult">Exam Result Notification</SelectItem>
                    <SelectItem value="announcement">General Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-bulk">Message</Label>
                <Textarea
                  id="message-bulk"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={5}
                />
              </div>

              <Button onClick={handleSendBulk} disabled={logSMS.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {logSMS.isPending ? 'Sending...' : 'Send Bulk SMS (Simulated)'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
