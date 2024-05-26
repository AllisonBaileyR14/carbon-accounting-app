import React from 'react';
import { Asset, Emission, EmissionDetail } from '../../types/emissions/types';
import { CSVLink } from 'react-csv';

interface AssetsTableProps {
    data: Asset[];
    prepareCSVData: () => any[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ data, prepareCSVData }) => {
    return (
        <div style={{ maxHeight: '400px', overflowY: 'scroll', marginTop: '20px' }}>
            <CSVLink
                data={prepareCSVData()}
                filename={`assets_data.csv`}
                className="btn btn-primary"
                style={{ marginBottom: '10px' }}
            >
                Export CSV
            </CSVLink>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Sector</th>
                        <th>Asset Type</th>
                        <th>Reporting Entity</th>
                        <th>Year</th>
                        <th>Activity</th>
                        <th>Activity Units</th>
                        <th>Capacity</th>
                        <th>Capacity Factor</th>
                        <th>Capacity Units</th>
                        <th>Emissions Factor</th>
                        <th>Emissions Factor Units</th>
                        <th>CO2</th>
                        <th>CH4</th>
                        <th>N2O</th>
                        <th>CO2e 20yr</th>
                        <th>CO2e 100yr</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((asset) => (
                        <React.Fragment key={asset.Id}>
                            {asset.Emissions.map((emission) =>
                                Object.entries(emission).map(([year, details]) => (
                                    details.map((detail, index) => (
                                        <tr key={`${year}-${index}`}>
                                            <td>{asset.Id}</td>
                                            <td>{asset.Name}</td>
                                            <td>{asset.Country}</td>
                                            <td>{asset.Sector}</td>
                                            <td>{asset.AssetType}</td>
                                            <td>{asset.ReportingEntity}</td>
                                            <td>{year}</td>
                                            <td>{detail.Activity !== null ? detail.Activity : 'N/A'}</td>
                                            <td>{detail.ActivityUnits !== null ? detail.ActivityUnits : 'N/A'}</td>
                                            <td>{detail.Capacity !== null ? detail.Capacity : 'N/A'}</td>
                                            <td>{detail.CapacityFactor !== null ? detail.CapacityFactor : 'N/A'}</td>
                                            <td>{detail.CapacityUnits !== null ? detail.CapacityUnits : 'N/A'}</td>
                                            <td>{detail.EmissionsFactor !== null ? detail.EmissionsFactor : 'N/A'}</td>
                                            <td>{detail.EmissionsFactorUnits !== null ? detail.EmissionsFactorUnits : 'N/A'}</td>
                                            <td>{detail.co2 !== null ? detail.co2 : 'N/A'}</td>
                                            <td>{detail.ch4 !== null ? detail.ch4 : 'N/A'}</td>
                                            <td>{detail.n2o !== null ? detail.n2o : 'N/A'}</td>
                                            <td>{detail.co2e_20yr !== null ? detail.co2e_20yr : 'N/A'}</td>
                                            <td>{detail.co2e_100yr !== null ? detail.co2e_100yr : 'N/A'}</td>
                                        </tr>
                                    ))
                                ))
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssetsTable;
