import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

type Props = {
  transactions: RevenueTransaction[]
}

function TableRevenueTransaction({ transactions }: Props) {
  return (
    <div className='bg-white w-full border border-gray-300 overflow-hidden rounded-xl shadow-lg'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-400'>
          <thead className='bg-gray-50'>
            <tr className='uppercase text-gray-400'>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Date & Time</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Product</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Price Unit</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Quantity</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Total Price</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>User</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-400 text-gray-900'>
            {transactions.map((trans) => {

              return (
                <tr key={trans.id} className='h-[64px]'>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.date}</td>
                  <td className='py-4 px-6 whitespace-nowrap'>
                    <p className="text-sm font-medium text-gray-900">{trans.product_name}</p>
                    <p className="text-xs text-gray-500">CODE: {trans.product_code}</p>
                  </td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.price_unit}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.quantity}</td>
                  <td className={`py-4 px-6 whitespace-nowrap text-sm ${trans.type === 'ORDER' ? 'text-green-600' : 'text-red-500'}`}>{trans.total_price} ${trans.type === 'ORDER' ? <TrendingUp /> : <TrendingDown />}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.user_code}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default TableRevenueTransaction