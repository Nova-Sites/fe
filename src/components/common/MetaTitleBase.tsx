import { Helmet } from '@dr.pogodin/react-helmet';

interface SeoProps {
  title: string;
  description?: string;
}

const MetaTitleBase: React.FC<SeoProps> = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name='description' content={description} />}
    </Helmet>
  );
};

export default MetaTitleBase;
