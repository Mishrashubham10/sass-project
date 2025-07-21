'use client';

// ========= REACT HOOK FORM =========
import { useForm } from 'react-hook-form';

// ========= ZOD =========
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ========= SHADCN COMPONENTS =========
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// ========= PRODUCT SCHEMA =========
import { productDetailsSchema } from '@/schema/products';
import { createProdudct, updateProdudct } from '@/server/actions/products';
import { toast } from 'sonner';

export default function ProductDetailForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string;
    url: string;
  };
}) {
  const form = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product?.description ?? '' }
      : {
          name: '',
          url: '',
          description: '',
        },
  });

  async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
    const action =
      product == null ? createProdudct : updateProdudct.bind(null, product.id);
    const data = await action(values);

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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                  {/* <RequiredLabelIcon /> */}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your website URL
                  {/* <RequiredLabelIcon /> */}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the
                  sales page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from
                other products
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}