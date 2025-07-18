'use client';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CopyCheckIcon, CopyIcon, CopyXIcon, Icon } from 'lucide-react';

export default function AddToSiteProductModalContent({ id }: { id: string }) {
  const code = `<script src="${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;

  return (
    <DialogContent className="max-w-max bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP discounts!
        </DialogDescription>
      </DialogHeader>
      <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState('copied');
                setTimeout(() => setCopyState('idle'), 3000);
              })
              .catch(() => {
                setCopyState('error');
                setTimeout(() => setCopyState('idle'), 3000);
              });
          }}
        >
          <Icon className="size-4 mr-2" />
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function getCopyIcon(copyState: copyState) {
  switch (copyState) {
    case 'idle':
      return CopyIcon;
    case 'copied':
      return CopyCheckIcon;
    case 'error':
      return CopyXIcon;
  }
}

function getChildren(copyState: copyState) {
  switch (copyState) {
    case 'idle':
      return 'Copy Code';
    case 'copied':
      return 'Copied!';
    case 'error':
      return 'Error';
  }
}