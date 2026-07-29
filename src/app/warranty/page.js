export default function WarrantyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Warranty & Return Policy</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">Warranty Policy</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>All new laptops come with a standard 1-year manufacturer warranty from the date of purchase.</li>
            <li>Refurbished laptops come with a 6-month store warranty covering hardware defects.</li>
            <li>Used laptops come with a 30-day satisfaction guarantee (testing period).</li>
            <li>Warranty does not cover physical damage, liquid damage, or unauthorized modifications.</li>
            <li>To claim warranty, contact us with your order number and describe the issue.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Return Policy</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Returns are accepted within 7 days of delivery for defective products.</li>
            <li>Items must be in their original packaging with all accessories, charger, and documentation.</li>
            <li>A 15% restocking fee applies for opened products that are not defective.</li>
            <li>Refunds are processed within 5-7 business days after we receive the returned item.</li>
            <li>To initiate a return, contact us with your order number and reason for return.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Wholesale Returns</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Wholesale orders of 10+ units may negotiate extended return terms during checkout.</li>
            <li>Bulk returns require 48-hour notice and authorization from our team.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
