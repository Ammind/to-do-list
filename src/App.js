import { useEffect, useState, useMemo } from "react";
import ItemVvod from "./ItemVvod";


function App() {

  const [spisok,setSpisok] = useState([])
  const [zadacha,setZadacha] = useState('')
  const [category,setСategory] = useState('')
  const [editId, setEditId] = useState(null);
  const [editt, setEditt] = useState('');
  const [selected, setSelected] = useState('');
  const [poisk, setPoisk] = useState('');
  const [selectedCategories, setSelectedCategories] = useState('');
  const [originalSpisok, setOriginalSpisok] = useState([]);



  const handleSubmit = (e) => {
  e.preventDefault()
  if(zadacha.trim()==='') return

  const newTask = {
    id: Date.now(),
    zadacha,
    done: false,
    category,
  }

  const updatedSpisok = [...spisok, newTask];
    setSpisok(updatedSpisok);
    setOriginalSpisok(updatedSpisok); // обновляем originalSpisok
    setZadacha('');
  }

  const deleteTask = (id) => {
    const updatedSpisok = spisok.filter(task => task.id !== id);
    setSpisok(updatedSpisok);
    setOriginalSpisok(updatedSpisok); // обновляем originalSpisok
  };

  const handleChenge = (e) => {
    const value = e.target.value
    setSelected(value)

    setSpisok((prev)=> {
    const sorted = [...prev].sort((a,b) => {
      if(value === 'a') {
        return(b.done === true) - (a.done === true)
      }
      if(value === 'b') {
        return(a.done === true) - (b.done === true)
      }
      return 0
    })
return sorted
  })
  }

  const handleCategories = (e) => {
    const value = e.target.value
    setSelectedCategories(value)

    setSpisok((prev)=> {
    const sorted = [...prev].sort((a,b) => {
      if(value === 'Работа') {
        return a.category === 'Работа' ? -1 : 1; 
      }
      if(value === 'Личное') {
        return a.category === 'Личное' ? -1 : 1; 
      }
      if(value === 'Учеба') {
        return a.category === 'Учеба' ? -1 : 1; 
      }
      return 0
    })
return sorted
  })
  }

  const toggleCheckbox = (id) => {
    setSpisok((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  
  const deleteAll = () => {
      setSpisok(spisok.filter(task => task.done !== true))
  }


  const colichestvo = spisok.length


  const colichestvoNeSdelano = useMemo(()=>{
  return spisok.reduce((acc, task) => {
    return task.done ? acc : acc + 1
  }, 0)
}, [spisok])



  // Загружаем список из localStorage при монтировании компонента
  useEffect(() => {
    const saved = localStorage.getItem('spisok');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setSpisok(parsedData);
          setOriginalSpisok(parsedData)
        } else {
          console.log("Нет данных для загрузки.");
        }
      } catch (error) {
        console.error("Ошибка при парсинге данных из localStorage", error);
      }
    }
  }, []);

  // Сохраняем список в localStorage при каждом изменении
  useEffect(() => {
    if (spisok.length > 0) {
      localStorage.setItem('spisok', JSON.stringify(spisok));
    } else {
      console.log("Список пуст, не сохраняем в localStorage.");
    }
  }, [spisok]);


  
  const handlePoisk = (e) => {
    if(e === '') {
      setSpisok(originalSpisok)
    } else {
    const filteredTasks = originalSpisok.filter(task => task.zadacha.toLowerCase().includes(e.toLowerCase()))
    setSpisok(filteredTasks)
  }
  }


  const otmenaRedactirovania = () => {
    setEditId(null);
    setEditt('');
  }


  return (
    <div className="App">
      <ItemVvod zadacha={zadacha} setZadacha={setZadacha} handleSubmit={handleSubmit} category={category} setСategory={setСategory}/>
        <button onClick={()=> deleteAll()}>
        Удалить все выполненые задачи
        </button>
      <select value={selected} onChange={handleChenge}>
        <option value=''>Сортировка</option>
        <option value='a'>Выполнено</option>
        <option value='b'>НЕ выполнено</option>
      </select>
      <select value={selectedCategories} onChange={handleCategories}>
        <option value=''>Сортировка по категориям</option>
        <option value='Работа'>Работа</option>
        <option value='Личное'>Личное</option>
        <option value='Учеба'>Учеба</option>
      </select>
      <input
      name="poisk"
      value={poisk}
      onChange={(e)=>{
        setPoisk(e.target.value);
        handlePoisk(e.target.value);
      }}
      >
      </input>
      <p>{`Осталось ${colichestvoNeSdelano} из ${colichestvo} задач`}</p>
      <ul>
        {spisok.map((item) => (
        <li key={item.id}>
          {editId === item.id ? 
          (
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSpisok((prev) =>
                      prev.map((task) =>
                        task.id === editId ? { ...task, zadacha: editt, category: category } : task
                        )
                      );
                    setEditId(null);
                    setEditt('');
                    }}
              >
                  <input
                    value={editt}
                    onChange={(e) => setEditt(e.target.value)}
                  />
                  <select value={category} onChange={(e)=> setСategory(e.target.value)}>
                    <option value=''>Тип:</option>
                    <option value='Работа'>Работа</option>
                    <option value='Личное'>Личное</option>
                    <option value='Учеба'>Учеба</option>
                  </select>
                  <button type="submit">Сохранить</button>
                  <button onClick={()=>otmenaRedactirovania()}>Отменить редактирование</button>
              </form>

          ) : (
            <>
                  <span>{item.zadacha}</span>
                  <span>{item.category}</span>
                  <button
                    onClick={() => {
                      setEditId(item.id);
                      setEditt(item.zadacha);
                    }}
                  >
                    ✏️ Редактировать
                  </button>
                  
            </>
          )}

          <button onClick={() => deleteTask(item.id)}>Удалить</button>

          <input
            type="checkbox"
            checked={item.done}
            onChange={() => toggleCheckbox(item.id)}
          />
        </li>
      ))}
      </ul>
    </div>
  );
}

export default App;





// setTtewrw((prev)=>
//   prev.map((item)=>
//     item.id === editId ? {...item, }
//   )
// )
