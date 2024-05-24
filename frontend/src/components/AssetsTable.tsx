import React from 'react';
import { Asset, EmissionDetail } from '../types/types';
import { CSVLink } from 'react-csv';

interface AssetsTableProps {
    data: Asset[];
    prepareCSVData: () => any[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ data, prepareCSVData }) => {
    return (
        <>
            <CSVLink
                data={prepareCSVData()}
                filename={`assets_data.csv`}
                className="btn btn-primary"
                style={{ marginBottom: '10px' }}
            >
                Export CSV
            </CSVLink>
            <div style={{ maxHeight: '400px', overflowY: 'scroll', marginTop: '20px' }}>
                <table>
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
                                {asset.Emissions.map((emission, emissionIndex) => (
                                    <React.Fragment key={emissionIndex}>
                                        {Object.entries(emission).map(([year, emissionArray], yearIndex) => (
                                            <React.Fragment key={yearIndex}>
                                                {emissionArray.map((detail, detailIndex) => (
                                                    <tr key={detailIndex}>
                                                        {detailIndex === 0 && yearIndex === 0 && (
                                                            <>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.Id}</td>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.Name}</td>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.Country}</td>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.Sector}</td>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.AssetType}</td>
                                                                <td rowSpan={emissionArray.length * asset.Emissions.length}>{asset.ReportingEntity}</td>
                                                            </>
                                                        )}
                                                        {detailIndex === 0 && (
                                                            <td rowSpan={emissionArray.length}>{year}</td>
                                                        )}
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
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AssetsTable;
