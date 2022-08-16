// jshint esversion:9

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadImage } from '../api';
import { addNewShopItem } from '../redux/features/items/itemsSlice';

export const NewItemPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const inputFileUpload = useRef(null);
  const submitForm = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePrice = (e) => {
    //regEx to prevent from typing letters
    const re = /^[0-9]*\.?[0-9]*$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setPrice(e.target.value);
    }
  };

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));
        setObjImageToUpload(e.target.files[0]);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { name, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

        let { data } = await createItem(requestBody);

        //console.log('newly created item =>', data);

        dispatch(addNewShopItem(data));

        setSuccessMessage('Item criado com sucesso.');

        setTimeout(() => navigate('/'), 5000);
      } else {
        const requestBody = { name, category, description, ingredients, price };

        let { data } = await createItem(requestBody);

        dispatch(addNewShopItem(data));

        //console.log('newly created item =>', data);

        setSuccessMessage('Item criado com sucesso.');

        setTimeout(() => navigate('/'), 5000);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Criar novo item</h2>

      {!successMessage && (
        <form onSubmit={handleSubmit}>
          <figure>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ width: '150px', height: 'auto' }} />}</figure>
          <div>
            <label htmlFor='name'>Nome</label>
            <div>
              <input id='add-item-name' name='name' type='text' required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor='category'>Categoria</label>
            <div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
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
            <label htmlFor='description'>Info</label>
            <div>
              <textarea id='add-item-description' name='description' required value={description} placeholder='Adicione descrição.' onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
          </div>

          <div>
            <label htmlFor='ingredients'>Ingredientes</label>
            <div>
              <textarea
                id='add-item-ingredients'
                name='ingredients'
                required
                value={ingredients}
                placeholder='Adicione ingredientes separados por virgula.'
                onChange={(e) => setIngredients(e.target.value)}
              ></textarea>
            </div>
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          <div>
            <div>
              <input ref={inputFileUpload} hidden type='file' onChange={(e) => handleFileUpload(e)} />
              <button type='button' onClick={() => inputFileUpload.current.click()}>
                Escolher Foto
              </button>
            </div>
            <button type='submit' ref={submitForm} hidden>
              Criar Item
            </button>
          </div>
        </form>
      )}

      {successMessage && <p>{successMessage}</p>}

      <div>
        {!successMessage && (
          <>
            <span onClick={() => navigate(-1)}>Voltar</span>
            <button type='button' onClick={() => submitForm.current.click()}>
              Criar Item
            </button>
          </>
        )}
      </div>
    </div>
  );
};
