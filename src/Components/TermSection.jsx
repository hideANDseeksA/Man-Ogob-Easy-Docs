import React from 'react';

const TermsSection = ({ title, content }) => {
  return (
    <div className='mb-6'>
    <p className='font-semibold text-[18px]'>{title}</p>
    <div className='text-gray-700'>
      {content.split('\n').map((line, index) => (
        <p key={index} className={line.startsWith('•') ? 'pl-5' : ''}>
          {line}
        </p>
      ))}
      <hr className='mt-5 border-black'/>
    </div>
  </div>
  );
};

export default TermsSection;