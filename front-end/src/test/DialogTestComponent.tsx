import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

export function DialogTestComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>
        Test Dialog Accessibility
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>
              This is a test dialog to verify accessibility compliance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <p>This dialog now has proper accessibility attributes!</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}