// =========== FORM & BUTTON COMPONENT ============
import CountryDiscoutForm from '@/app/dashboard/_components/forms/CountryDiscoutForm';
import ProductCustomizationForm from '@/app/dashboard/_components/forms/ProductCustomizationForm';
import ProductDetailForm from '@/app/dashboard/_components/forms/ProductDetailForm';
import PageWithBackButton from '@/app/dashboard/_components/PageWithBackButton';

// =========== SHADCN CARD COMPONENTS ==========
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// =========== SHADCN TAB COMPONENTS ==========
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// =========== SERVER DB ACTIONS ==========
import { getProduct, getProductCountryGroups, getProductCustomization } from '@/server/db/products';
import { canCustomizeBanner, canRemoveBranding } from '@/server/permissions';

// =========== CLERK SERVER ==========
import { auth } from '@clerk/nextjs/server';

// =========== NEXT / LINK ==========
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
         {/* ======== DETAILS TAB ========== */}
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
         {/* ======== COUNTRY TAB ========== */}
        <TabsContent value="countries">
          <CountryTab productId={productId} userId={userId} />
        </TabsContent>
        {/* ======== CUSTOMIZATION TAB ========== */}
        <TabsContent value="customization">
          <CustomizationsTab productId={productId} userId={userId} />
          Customization
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}

// ============ DETAILS TAB =============
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
        <ProductDetailForm
          product={{ ...product, description: product.description ?? '' }}
        />
      </CardContent>
    </Card>
  );
}

// ============= COUNTRY TAB =============
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


// ============= CUSTOMIZATION TAB =============
async function CustomizationsTab({
  productId,
  userId,
}: {
  productId: string
  userId: string
}) {
  const customization = await getProductCustomization({ productId, userId })

  if (customization == null) return notFound()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={await canRemoveBranding(userId)}
          canCustomizeBanner={await canCustomizeBanner(userId)}
          customization={customization}
        />
      </CardContent>
    </Card>
  )
}