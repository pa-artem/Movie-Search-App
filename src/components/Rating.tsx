import RatingStar from './RatingStar';

type RatingProps = {
  rating: number;
};

const Rating = ({ rating }: RatingProps) => (
  <div className="rating">
    <div className="stars">
      {[...Array(5).keys()].map((i) => {
        const fraction = Math.min(Math.max(rating / 2 - i, 0), 1);
        return <RatingStar key={i} fraction={fraction} />;
      })}
    </div>
    <div className="text">
      Рейтинг:&nbsp;
      {rating}
    </div>
  </div>
);
export default Rating;