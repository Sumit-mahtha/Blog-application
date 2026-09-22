'use client'
import React, { useState } from 'react';
import axios from 'axios';

const AiSummarizer = ({ title, content }) => {
    const [summary, setSummary] = useState(null);
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/summarize', {
                title,
                content
            });

            if (response.data.success) {
                setSummary(response.data.summary);
                setPoints(response.data.points || []);
            } else {
                setError(response.data.msg || 'Failed to generate summary.');
            }
        } catch (err) {
            console.error('Summary error:', err);
            setError('Something went wrong generating the summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!summary) return;
        const textToCopy = `${summary}\n\nKey Takeaways:\n${points.map(p => `• ${p}`).join('\n')}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='my-8 p-6 bg-gradient-to-r from-slate-50 to-gray-100 border-2 border-black rounded-lg shadow-[-6px_6px_0px_#000000]'>
            {/* Header */}
            <div className='flex items-center justify-between flex-wrap gap-2 mb-4'>
                <div className='flex items-center gap-2'>
                    <span className='text-2xl'>🤖</span>
                    <div>
                        <h3 className='text-lg font-bold text-gray-900'>AI Blog Summarizer</h3>
                        <p className='text-xs text-gray-500'>Get a 30-second quick breakdown before reading</p>
                    </div>
                </div>

                {!summary && (
                    <button
                        onClick={handleSummarize}
                        disabled={loading}
                        className='cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-black text-white font-medium text-sm border border-black hover:bg-gray-800 transition active:scale-95 disabled:opacity-60'
                    >
                        {loading ? (
                            <>
                                <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                                Analyzing...
                            </>
                        ) : (
                            <>✨ Summarize with AI</>
                        )}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className='text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200 mt-2'>{error}</p>
            )}

            {/* Summary Content Result */}
            {summary && (
                <div className='mt-4 pt-4 border-t border-gray-300 space-y-4'>
                    <div>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 mb-1'>Quick Overview</h4>
                        <p className='text-gray-800 text-sm leading-relaxed'>{summary}</p>
                    </div>

                    {points.length > 0 && (
                        <div>
                            <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 mb-2'>Key Takeaways</h4>
                            <ul className='space-y-1.5'>
                                {points.map((point, idx) => (
                                    <li key={idx} className='flex items-start gap-2 text-sm text-gray-700'>
                                        <span className='text-green-600 font-bold'>✓</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex items-center justify-between pt-2 text-xs'>
                        <button
                            onClick={handleCopy}
                            className='cursor-pointer text-gray-600 hover:text-black font-semibold flex items-center gap-1'
                        >
                            {copied ? '✅ Copied to clipboard!' : '📋 Copy summary'}
                        </button>
                        <button
                            onClick={handleSummarize}
                            disabled={loading}
                            className='cursor-pointer text-gray-500 hover:text-black underline'
                        >
                            {loading ? 'Regenerating...' : 'Regenerate'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiSummarizer;