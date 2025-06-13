import React from 'react'

const ItemVvod = ({handleSubmit, zadacha, setZadacha, category, setСategory}) => {
  return (
    <form onSubmit={handleSubmit}>
        <input
        name="zadacha"
        value={zadacha}
        onChange={(e)=>setZadacha(e.target.value)}
        placeholder='Название задачи'
        />
        <select value={category} onChange={(e)=> setСategory(e.target.value)}>
          <option value=''>Тип:</option>
          <option value='Работа'>Работа</option>
          <option value='Личное'>Личное</option>
          <option value='Учеба'>Учеба</option>
        </select>
        <button type="submit">Отправить</button>
    </form>
  )
}

export default ItemVvod
