'use client';

export default function SpecTable({ specifications }) {
  if (!specifications) return null;

  const labels = {
    processor: 'Processor',
    processorBrand: 'Processor Brand',
    processorModel: 'Processor Model',
    ram: 'RAM',
    ramType: 'RAM Type',
    storage: 'Storage',
    storageType: 'Storage Type',
    gpu: 'Graphics Card',
    displaySize: 'Display Size',
    displayResolution: 'Display Resolution',
    displayType: 'Display Type',
    battery: 'Battery',
    ports: 'Ports',
    os: 'Operating System',
    weight: 'Weight',
    warranty: 'Warranty',
    color: 'Color',
  };

  const entries = Object.entries(specifications).filter(([, v]) => v);

  if (entries.length === 0) return null;

  return (
    <table className="w-full text-sm">
      <tbody>
        {entries.map(([key, value], idx) => (
          <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="px-4 py-2 font-medium text-gray-600 w-1/3">{labels[key] || key}</td>
            <td className="px-4 py-2 text-gray-900">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
