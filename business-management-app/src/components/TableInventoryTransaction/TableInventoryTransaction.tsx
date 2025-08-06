import React from 'react'

type Props = {
  transactions: InventoryTransaction[]
}

function TableInventoryTransaction({ transactions }: Props) {
  return (
    <div className='bg-white w-full border border-gray-300 overflow-hidden rounded-xl shadow-lg'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-400'>
          <thead className='bg-gray-50'>
            <tr className='uppercase text-gray-400'>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Date & Time</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Product</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Type</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Quantity</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Previous</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>New</th>
              <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>User</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-400 text-gray-900'>
            {transactions.map((trans) => {
              return (
                <tr key={trans.id} className='h-[50px]'>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.date}</td>
                  <td className='py-4 px-6 whitespace-nowrap'>
                    <p className="text-sm font-medium text-gray-900">{trans.product_name}</p>
                    <p className="text-xs text-gray-500">CODE: {trans.product_id}</p>
                  </td>
                  <td className={`py-4 px-6 whitespace-nowrap text-[10px] `}>
                    <span className={`p-[6px] rounded-2xl font-bold ${trans.type === 'RESTOCK' ? "bg-green-100 text-green-800" : trans.type === 'SALE' ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {trans.type}
                    </span>
                  </td>
                  <td className={` ${trans.type === 'SALE' ? 'text-red-600' : 'text-green-600'} font-semibold py-4 px-6 whitespace-nowrap text-sm text-right`}>{trans.type === 'SALE' ? '-' : '+'}{trans.quantity} {trans.unit}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.previous_quantity} {trans.unit}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.new_quantity} {trans.unit}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-sm'>{trans.user}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableInventoryTransaction