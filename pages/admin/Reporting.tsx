import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import { postReportingAPI } from '@/services/api/admin';

const Reporting: React.FC = () => {
    const { t, addToast } = useAppContext();
    const today = new Date().toISOString().split('T')[0];

    const [reportType, setReportType] = useState('demographics');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [exportFormat, setExportFormat] = useState('csv');


    const handleReporting = async () => {
        try {
            const payload = {
                reportType: reportType,
                startDate: startDate,
                endDate: endDate,
            };
            console.log('Reporting payload:', payload);
            const response = await postReportingAPI(payload);

            const blob = new Blob([response], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${reportType}_report_${startDate}_to_${endDate}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);



            // ✅ Success handling
            console.log('Chat reported successfully:', response);
            addToast(t('toasts.report.generated').replace('{reportName}', reportType), 'success');

        } catch (error) {
            // ❌ Error handling
            console.error('Failed to report chat:', error);
            addToast('Reprt generating failed', 'error');
        }
    };
    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        handleReporting();
        return;
        // Mock data generation
        let csvContent = "data:text/csv;charset=utf-8,";
        let reportName = '';

        if (reportType === 'demographics') {
            reportName = t('admin.reporting.type.demographics');
            csvContent += "UserID,Age,Location,Caste,Profession\n";
            csvContent += "1,28,Bangalore,Brahmin,Software Engineer\n";
            csvContent += "2,31,Mumbai,Kshatriya,Doctor\n";
            csvContent += "3,29,Delhi,Vaishya,Architect\n";
        } else {
            reportName = t('admin.reporting.type.engagement');
            csvContent += "Date,SignUps,MessagesSent,MatchesMade\n";
            csvContent += "2024-07-26,52,8230,210\n";
            csvContent += "2024-07-27,68,9500,350\n";
            csvContent += "2024-07-28,75,12543,432\n";
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportType}_report_${startDate}_to_${endDate}.${exportFormat}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast(t('toast.report.generated').replace('{reportName}', reportName), 'success');
    };



    return (
        <Card>
            <h1 className="text-3xl font-bold text-white mb-2">{t('admin.reporting.title')}</h1>
            <p className="text-gray-400 mb-6">{t('admin.reporting.subtitle')}</p>

            <form onSubmit={handleExport} className="space-y-6 max-w-2xl">
                <Dropdown
                    id="reportType"
                    label={t('admin.reporting.report_type')}
                    value={reportType}
                    onChange={setReportType}
                    options={[
                        { value: 'demographics', label: t('admin.reporting.type.demographics') },
                        { value: 'engagements', label: t('admin.reporting.type.engagement') }
                    ]}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.reporting.date_range')}</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input id="startDate" label={t('admin.reporting.start_date')} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <Input id="endDate" label={t('admin.reporting.end_date')} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                {/* <Dropdown
                    id="exportFormat"
                    label={t('admin.reporting.export_format')}
                    value={exportFormat}
                    onChange={setExportFormat}
                    options={[
                        { value: 'XL', label: 'EXCEL' },
                        // { value: 'pdf', label: 'PDF (coming soon)' }
                    ]}
                /> */}

                <div className="pt-2">
                    <Button type="submit">{t('admin.reporting.cta')}</Button>
                </div>
            </form>
        </Card>
    );
};

export default Reporting;


