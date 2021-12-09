import Movie from '@ts/Movie';
import useFavoriteMovie from '@hooks/useFavoriteMovie';

import styles from './styles.module.scss';

interface PropsType {
  movie: Movie;
  className?: string;
}

const FavoriteButton = ({ movie, className = '' }: PropsType) => {
  const { favorite, change: changeFavorite } = useFavoriteMovie({ movie });

  return (
    <button
      className={`${styles['add-to-favorites-button']} ${
        favorite ? styles['add-to-favorites-button-checked'] : ''
      } ${className}`}
      aria-label="Add to favorites"
      type="button"
      onClick={changeFavorite}
    >
      <svg
        className={styles['add-to-favorites-icon']}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      >
        <path
          d="m -936.69875,909.3642 c -0.88914,-0.047 -1.75905,0.2466 -2.4043,0.8925 -1.29049,1.2919 -1.17491,3.4894 0.25977,4.9258 l 0.51562,0.5156 4.66016,4.6641 4.6582,-4.6641 0.51563,-0.5156 c 1.43474,-1.4364 1.55025,-3.6339 0.25976,-4.9258 -1.29048,-1.2918 -3.48322,-1.1745 -4.91797,0.2618 l -0.51562,0.5175 -0.51758,-0.5175 c -0.71734,-0.7181 -1.62453,-1.1072 -2.51367,-1.1543 z"
          transform="translate(942 -906.362)"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
