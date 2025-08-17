import { Discount } from '@/types/Discount'
import formatCurrency from '@/utils/formatCurrency';
import { Check, Tag, X, Percent, DollarSign, Sparkles, TicketPercent } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    appliedDiscount?: Discount,
    onApplyDiscount: (discountCode: string) => void;
    onRemoveDiscount: () => void;
}

export default function DiscountApply({ appliedDiscount, onApplyDiscount, onRemoveDiscount }: Props) {
    useEffect(() => {
        console.log(appliedDiscount);
    }, [appliedDiscount])

    const [discountCode, setDiscountCode] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleApplyDiscount = () => {
        if (discountCode.trim()) {
            onApplyDiscount(discountCode.trim());
            setDiscountCode("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyDiscount();
        }
    };

    const getDiscountIcon = (type: string) => {
        return type === 'PERCENTAGE' ? <Percent size={16} /> : <DollarSign size={16} />;
    };

    return (
        <div className="mt-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                            <Tag className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Discount & Promotions</h2>
                            <p className="text-purple-100 text-sm">Save money with our special offers</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {!appliedDiscount ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <TicketPercent className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-purple-500' : 'text-gray-400'
                                        }`} />
                                </div>
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${isFocused
                                            ? 'border-purple-400 bg-white'
                                            : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                                        } uppercase font-medium text-gray-700 placeholder-gray-400`}
                                    placeholder="Enter your discount code"
                                />
                            </div>

                            <button
                                onClick={handleApplyDiscount}
                                disabled={!discountCode.trim()}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${discountCode.trim()
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200'
                                        : 'bg-gray-300 cursor-not-allowed shadow-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-center">
                                    <Check size={20} className="mr-2" />
                                    Apply Discount Code
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-500 rounded-lg">
                                            <Check className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-green-800">
                                                    {appliedDiscount.code}
                                                </span>
                                                <div className="flex items-center text-green-600">
                                                    {getDiscountIcon(appliedDiscount.type)}
                                                    <span className="ml-1 font-semibold">
                                                        {appliedDiscount.type === 'PERCENTAGE'
                                                            ? `${appliedDiscount.value}%`
                                                            : formatCurrency(appliedDiscount.value)
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-green-600 text-sm">
                                                Discount successfully applied!
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onRemoveDiscount}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        title="Remove discount"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-gray-600 text-sm mb-3">Want to apply another discount?</p>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <TicketPercent className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-purple-500' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onKeyPress={handleKeyPress}
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${isFocused
                                                ? 'border-purple-400 bg-white'
                                                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                                            } uppercase font-medium text-gray-700 placeholder-gray-400 text-sm`}
                                        placeholder="Enter another discount code"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                    💡 Have a promotional code? Enter it above to save on your purchase!
                </p>
            </div>
        </div>
    )
}