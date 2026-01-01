import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';

export const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { getDoctorsData } = useContext(AppContext);
  // const [filterDoc, setfilterDoc] = useState([]);
  const [showFilter, setfilter] = useState(false);
  const [list, setList] = useState([]);
  const [finalList, setFinalList] = useState([])

  // const applyFilter = () => {
  //   if (speciality) {
  //     setFinalList(list.filter(doc => doc.speciality === speciality))
  //   } else {
  //     setFinalList(list)
  //   }
  // }


  const doc = async () => {
    const list1 = await getDoctorsData();
    setList(list1)
    setFinalList(list1)
  }
  useEffect(() => {
    doc()
  }, [])

  useEffect(() => {
    if (speciality) {
      setFinalList(list.filter(doc => doc.speciality === speciality));
    } else {
      setFinalList(list);
    }
  }, [list, speciality]);
  return (
    <div>
      <div>
        <p className=' ml-16 text-gray-600'>Browse through the doctors specialist.</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
          <button onClick={() => setfilter(prev => !prev)} className={`py1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-500 text-white' : ''}`}>Filter</button>
          <div className={`flex-col ml-16 gap-4 text-gray-600 text-sm ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
            <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
            <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
            <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
            <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
            <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
            <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[20vw] sm-w-auto mt-4 pl-3 py-1.5 pl-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
          </div>
          <div className='w-full mx-24 mt-4 grid grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>
            {
              finalList.map((item, index) => (
                <div onClick={() => navigate(`/doctors-appointments/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                  <img className='bg-blue-50' src={item.image} alt={item.name} />
                  <div className='p-4' >
                    <div className={`flex items-center gap-2  text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                      <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 yexy-sm'>{item.speciality}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
