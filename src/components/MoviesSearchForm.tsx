import { useState } from 'react';

export type MoviesSearchHandler = (searchQuery: string) => void;

type FormProps = {
  onSubmit: MoviesSearchHandler;
};

const MoviesSearchForm = ({ onSubmit }: FormProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form
      method="get"
      className="movie-search-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(searchQuery);
      }}
    >
      <label htmlFor="title-query" className="title-input-label">
        Название фильма
      </label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        name="movie-title-query"
        id="movie-title-query"
        className="title-input"
        placeholder='Например, "Гарри Поттер"'
      />
      <button type="submit">Поиск</button>
    </form>
  );
};

export default MoviesSearchForm;