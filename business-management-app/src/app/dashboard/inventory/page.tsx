'use client'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading/Loading';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import SearchBar from '@/components/SearchBar/SearchBar';
import TagFilter from '@/components/TagFilter/TagFilter';
import useFetchList from '@/hooks/useFetchList';
import useInventoryStatus from '@/hooks/useInventoryStatus';
import useProductQuery from '@/hooks/useProductQuery';
import React, { useState } from 'react'

function Inventory() {


  const { query, changeSearchVal, changeStockFilter, resetStockFilter } = useProductQuery();

  const { data: products, loading, error } = useFetchList("products", query);
  const { totalStock, totalLowStockItem, totalOutStockItem } = useInventoryStatus();

  const [activeFilter, setActiveFilter] = useState<string[]>(["All"]);

  const tags = ['All', 'Low Stock', "Out Of Stock"];
  const tagsValues: Record<string, string> = {
    'Low Stock': "low",
    'Out Of Stock': "out"
  }

  const handleFilter = (filter: string) => {
    setActiveFilter(filter ? [filter] : []);

    if (filter === "All") {
      resetStockFilter();
      return;
    }

    changeStockFilter(tagsValues[filter] || "");
  }

  if (loading) {
    return <Loading state='loading' />;
  }

  return (
    <div className='w-full'>
      <h1>Products Stock</h1>

      <div className='flex gap-4 p-5 bg-white rounded-xl shadow-lg'>
        <Card title='Overall Stock' description="The total number of unique products" content={totalStock} icon='Layers' iconColor='text-blue-400' />
        <Card title='Low Stock Items' description='Number of products with quantities at or below the low stock threshold' content={totalLowStockItem} icon='ChevronsDown' iconColor='text-red-400' />
        <Card title='Zero Stock Items' description='Count of products that currently have a quantity of zero in stock.' content={totalOutStockItem} icon='CircleSlash2' iconColor='text-gray-400' />
      </div>

      <div className='mt-5 flex gap-4'>
        <div className='wrapper p-4'>
          <div className='mb-4'>
            <TagFilter onToggle={handleFilter} tags={tags} selectedTags={activeFilter} multiple={false} />
          </div>
          <SearchBar onSearch={changeSearchVal} bg_color='bg-white' border_color='border-white' />
          <ProductListTable products={products} type='all' />
        </div>
      </div>
    </div>
  )
}

export default Inventory