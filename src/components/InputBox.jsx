import React from 'react'

function InputBox({
    title,
    addbtn="Add",
    handleTitleChange,
    text,
    handleTextChange,
    handleAdd
}) {
    return (
        <>
            <div className='w-5/6 h-full bg-[#9a5938] p-5 mx-10'>
                <div className='text-title w-5/6 h-5/6 my-3'>
                    <input 
                        type='text' 
                        placeholder='Add-title' 
                        value={title} 
                        onChange={handleTitleChange} 
                        className='w-5/6 h-16 rounded-lg px-5' 
                    />
                </div>
                {/* Parent div with flexbox to align textarea and button side by side */}
                <div className='flex items-center text-area w-full h-5/6 my-3'>
                    <textarea 
                        type='text' 
                        placeholder='Enter Your Text Here' 
                        value={text} 
                        onChange={handleTextChange} 
                        className='flex h-20 w-4/5 min-h-40 rounded-lg px-3 mr-3' // Use 'flex-grow' to make textarea fill available space
                    />
                    <button 
                        className='p-4 text-xl bg-violet-400 rounded-2xl' 
                        onClick={handleAdd}
                    >
                        {addbtn}
                    </button>
                </div>
            </div>
        </>
    )
}

export default InputBox;
