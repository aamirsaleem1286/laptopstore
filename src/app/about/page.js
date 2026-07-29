export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About LaptopStore</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-4">
          LaptopStore is Pakistan&apos;s trusted destination for quality laptops — serving both retail customers and wholesale buyers.
        </p>
        <p className="text-gray-600 mb-4">
          Founded with the mission to make quality laptops accessible to everyone, we partner with leading brands including Apple, HP, Dell, Lenovo, Asus, and Acer to offer the widest selection at competitive prices.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-3">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {[
            { title: 'Genuine Products', desc: '100% authentic laptops with full manufacturer warranty' },
            { title: 'Best Prices', desc: 'Competitive retail and wholesale pricing on all models' },
            { title: 'Nationwide Delivery', desc: 'Shipping across all major cities in Pakistan' },
            { title: 'Expert Support', desc: 'Knowledgeable team to help you find the perfect laptop' },
          ].map((feature) => (
            <div key={feature.title} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
