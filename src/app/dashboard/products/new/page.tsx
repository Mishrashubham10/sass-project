import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canCreateProduct } from '@/server/permissions';
import PageWithBackButton from '../../_components/PageWithBackButton';
import HasPermission from '@/components/HasPermission';
import ProductDetailForm from '../../_components/forms/ProductDetailForm';

export default function NewProductPage() {
  return (
    <PageWithBackButton
      pageTitle="Create Product"
      backButtonHref="/dashboard/products"
    >
      <HasPermission
        permission={canCreateProduct}
        renderFallback
        fallbackText="You have already created the maximum number of products. Try upgrading your account to create more."
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailForm />
          </CardContent>
        </Card>
      </HasPermission>
    </PageWithBackButton>
  );
}