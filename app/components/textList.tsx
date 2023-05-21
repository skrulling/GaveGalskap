import React, { useState, useEffect } from 'react';

interface TextListProps {
  inputText: string;
}

const TextList: React.FC<TextListProps> = ({ inputText }) => {
  const [listItems, setListItems] = useState<string[]>([]);

  useEffect(() => {
    const splitItems = inputText.split(/(?<=\.)\s+(?=\d\.)/);
    setListItems(splitItems);
  }, [inputText]);

  return (
    <ul className='list-none mb-2'>
      {listItems.map((item, index) => (
        <li key={index} className='text-white text-left my-1'>{item}</li>
      ))}
    </ul>
  );
};

export default TextList;
