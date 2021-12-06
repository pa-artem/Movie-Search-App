import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '@ts/Movie';
import MovieCard from '@components/MovieCard';
import MoviesSearchForm from '@components/MoviesSearchForm';
import LoadingAnimation from '@components/Loading';
import LanguageSelect from '@components/LanguageSelect';
import ColorThemeSwitch from '@components/ColorThemeSwitch';
import LanguageType, * as Language from '@ts/Language';
import useLocalStorage from '@app/hooks/useLocalStorage';
import useQueryMovies from '@hooks/useQueryMovies';
import MoviesSearchContext from './MoviesSearchContext';

import styles from './styles.module.scss';

const MoviesSearchApp = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    i18n.language ? Language.fromString(i18n.language) : Language.DEFAULT,
  );

  useEffect(() => {
    i18n.changeLanguage(Language.toString(language));
  }, [i18n, language]);

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
    },
    [setLanguage],
  );

  const [darkModeEnabled, setDarkMode] = useLocalStorage('darkMode', false);

  const handleColorThemeChange = useCallback(
    (darkModeEnabled) => {
      setDarkMode(darkModeEnabled);
    },
    [setDarkMode],
  );

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.dataset.theme = 'dark';
    } else {
      delete document.body.dataset.theme;
    }
  }, [darkModeEnabled]);

  const API_KEY = '2ab87dbd3a5185ee9af24363729e47a9';
  const [queryString, setQueryString] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [loadNextPage, setLoadNextPage] = useState(false);

  const [lastCard, setLastCard] = useState<HTMLDivElement | null>(null);

  const observerCallback = useCallback<IntersectionObserverCallback>(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.target == lastCard && entry.isIntersecting) {
          setLoadNextPage(true);
        }
      }
    },
    [lastCard],
  );

  const [observer, setObserver] = useState(() => new IntersectionObserver(observerCallback));

  const lastCardMounted = useCallback((lastCardElement) => {
    setLastCard((prevCard) => {
      if (prevCard == lastCardElement) {
        return prevCard;
      }
      if (prevCard != null) {
        observer.unobserve(prevCard);
      }
      return lastCardElement;
    });
  }, []);

  useEffect(() => {
    const prevObserver = observer;
    setObserver(new IntersectionObserver(observerCallback));

    return () => prevObserver.disconnect();
  }, [observerCallback]);

  useEffect(() => {
    if (lastCard == null) {
      return;
    }

    observer.observe(lastCard);
  }, [lastCard, observer]);

  const [loadedMovies, setLoadedMovies] = useState<Movie[]>([]);

  // For some reason TMDB sometimes returns duplicate movies
  const [loadedMovieIds, setLoadedMoviesIds] = useState<Set<number>>(new Set());

  const [queriedMoviesPage, loadingMovies] = useQueryMovies({
    queryString,
    page: currentPage,
    language,
    apiKey: API_KEY,
  });

  useEffect(() => {
    setLoadedMovies((prevLoadedMovies) => {
      const newLoadedMovies = [...prevLoadedMovies];
      for (const movie of queriedMoviesPage) {
        if (!loadedMovieIds.has(movie.id)) {
          loadedMovieIds.add(movie.id);
          newLoadedMovies.push(movie);
        }
      }
      return newLoadedMovies;
    });
  }, [queriedMoviesPage]);

  const movieCards = loadedMovies.map((movie, index, array) =>
    index == array.length - 1 ? (
      <MovieCard key={movie.id} movie={movie} ref={lastCardMounted} />
    ) : (
      <MovieCard key={movie.id} movie={movie} />
    ),
  );

  const leftMoviesColumn = movieCards.filter((_, i) => i % 2 == 0);
  const rightMoviesColumn = movieCards.filter((_, i) => i % 2 != 0);

  const moviesPage = (
    <>
      <div className={styles['movies-page']}>
        <div className={styles['movies-column']}>{leftMoviesColumn}</div>
        <div className={styles['movies-column']}>{rightMoviesColumn}</div>
      </div>
      {loadingMovies && <LoadingAnimation loadingText={t('loading')} />}
    </>
  );

  const onSearchFormSubmit = useCallback((newQueryString) => {
    if (newQueryString == queryString) {
      return;
    }

    setQueryString(newQueryString);
    setLoadedMovies([]);
    setCurrentPage(1);
    setLoadedMoviesIds(new Set());
  }, [queryString]);

  useEffect(() => {
    if (!loadNextPage) {
      return;
    }

    setLoadNextPage(false);
    setCurrentPage((prevPage) => prevPage + 1);
  }, [loadNextPage]);

  return (
    <MoviesSearchContext.Provider value={{ darkModeEnabled, language, apiKey: API_KEY }}>
      <h1>{t('title')}</h1>
      <div className={styles['search-movies']}>
        <div className={styles['interface-container']}>
          <LanguageSelect
            value={language}
            onChange={handleLanguageChange}
            languages={[LanguageType.ENGLISH_US, LanguageType.RUSSIAN]}
            className={styles['choose-language-select']}
          />
          <ColorThemeSwitch
            darkModeEnabled={darkModeEnabled ?? false}
            onThemeChange={handleColorThemeChange}
            className={styles['change-color-theme']}
          />
          <MoviesSearchForm onSubmit={onSearchFormSubmit} />
        </div>
        {moviesPage}
      </div>
    </MoviesSearchContext.Provider>
  );
};

export default MoviesSearchApp;
