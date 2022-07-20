// jshint esversion:9

import { useState } from 'react';
import { addItem } from '../api';

export const NewItemPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { name, category, imageUrl, description, price };

      let response = await addItem(requestBody);
      console.log('newly created item =>', response.data);

      setSuccessMessage('A sua palavra pass foi actualizada com sucesso.');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  const handlePrice = (e) => {
    //regEx to prevent from typing letters
    const re = /^[0-9]*\.?[0-9]*$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setPrice(e.target.value);
    }
  };

  return (
    <div>
      <h2>Adicionar novo item</h2>

      {!successMessage && (
        <form onSubmit={handleAddItem}>
          <div>
            <label htmlFor='name'>Nome</label>
            <div>
              <input id='add-item-name' name='name' type='text' required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor='category'>Categoria</label>
            <div>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value='' disabled></option>
                <option value='doces'>Doces</option>
                <option value='salgados'>Salgados</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor='price'>Preço</label>
            <div>
              <input id='add-item-price' name='price' type='text' required value={price} onChange={handlePrice} />
            </div>
          </div>

          <div>
            <label htmlFor='description'>Ingredientes</label>
            <div>
              <textarea id='add-item-description' name='description' required value={description} placeholder='Adicione ingredientes.' onChange={(e) => setDescription(e.target.value)}>
                {' '}
              </textarea>
            </div>
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          <div>
            <button type='submit'>Adicionar</button>
          </div>
        </form>
      )}

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
