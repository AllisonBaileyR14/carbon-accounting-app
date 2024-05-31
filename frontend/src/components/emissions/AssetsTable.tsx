import React from 'react';
import { Asset, Emission, EmissionDetail } from '../../types/emissions/types';
import { CSVLink } from 'react-csv';

interface AssetsTableProps {
    data: Asset[];
    prepareCSVData: () => any[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ data, prepareCSVData }) => {
    return (
        <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sector
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subsector
                        </th>
                        {/* other headers */}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((asset) => (
                        <tr key={asset.Id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.Id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.Name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.Country}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.Sector}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.Subsectors}</td>
                            {/* other columns */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default AssetsTable;
