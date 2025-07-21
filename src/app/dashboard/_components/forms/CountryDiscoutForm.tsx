"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { productCountryDiscountsSchema } from '@/schema/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export default function CountryDiscoutForm({
  productId,
  countryGroups,
}: {
  productId: string;
  countryGroups: {
    id: string;
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
      name: string;
      code: string;
    }[];
    discount?: {
      coupon: string;
      discountPercentage: number;
    };
  }[];
}) {
  const form = useForm<z.infer<typeof productCountryDiscountsSchema>>({
    resolver: zodResolver(productCountryDiscountsSchema),
    defaultValues: {
      groups: countryGroups.map((group) => {
        const discount =
          group.discount?.discountPercentage ??
          group.recommendedDiscountPercentage;

        return {
          countryGroupId: group.id,
          coupon: group.discount?.coupon ?? '',
          discountPercentage: discount != null ? discount * 100 : undefined,
        };
      }),
    },
  });

  function onSubmit(values: z.infer<typeof productCountryDiscountsSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {countryGroups.map((group) => (
          <Card key={group.id}>
            <CardContent className="pt-6 flex gap-16 items-center mt-2">
              <div className="">
                <h2 className="">{group.name}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </form>
    </Form>
  );
}