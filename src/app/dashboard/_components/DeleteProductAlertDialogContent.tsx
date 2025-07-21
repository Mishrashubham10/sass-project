"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteProduct } from '@/server/actions/products';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function DeleteProductAlertDialogContent({
  id,
}: {
  id: string;
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <AlertDialogContent className='bg-white'>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProduct(id);
              if (data?.message) {
                toast(data.message, {
                  description: data.error ? 'Error' : 'Success',
                });
                if (data?.error) {
                  toast.error(data.message);
                } else {
                  toast.success(data.message);
                }
              }
            });
          }}
          disabled={isDeletePending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}