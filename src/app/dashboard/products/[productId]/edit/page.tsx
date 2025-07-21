import CountryDiscoutForm from '@/app/dashboard/_components/forms/CountryDiscoutForm';
import ProductDetailForm from '@/app/dashboard/_components/forms/ProductDetailForm';
import PageWithBackButton from '@/app/dashboard/_components/PageWithBackButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProduct, getProductCountryGroups } from '@/server/db/products';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

export default async function EditProductPage({
  params: { productId },
  searchParams: { tab = 'details' },
}: {
  params: { productId: string };
  searchParams: { tab?: string };
}) {
  console.log(productId);
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  // ========== GET PRODUCT DETAIL ==========
  const product = await getProduct({ id: productId, userId });

  if (product == null) return notFound();
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Edit Product"
    >
      <Tabs defaultValue={tab}>
        <TabsList className="bg-background/60">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="countries">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="countries">
          <CountryTab productId={productId} userId={userId} />
        </TabsContent>
        <TabsContent value="customization">
          {/* <CustomizationsTab productId={productId} userId={userId} /> */}
          Customization
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}

function DetailsTab({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDetailForm product={{ ...product, description: product.description ?? '' }} />
      </CardContent>
    </Card>
  );
}

async function CountryTab({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const countryGroups = await getProductCountryGroups({
    productId,
    userId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscoutForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  );
}