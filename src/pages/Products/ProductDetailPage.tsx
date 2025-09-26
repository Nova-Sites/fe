import React from 'react';
import { useParams } from 'react-router-dom';
import { UserLayout } from '@/components/layouts';
import { LoadingBase, ButtonBase, MetaTitleBase } from '@/components/common';
import { SEO_META } from '@/constants';
import {
  Chip,
  Stack,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight, PlayArrow } from '@mui/icons-material';
import type { Product, ProductImage } from '@/types';
import { useProduct } from '@/hooks/useProducts';

type MediaItem =
  | { type: 'image'; src: string; thumb: string }
  | { type: 'video'; src: string; thumb: string };

const isDirectVideo = (url: string): boolean => /\.(mp4|webm|ogg)$/i.test(url);

const getYouTubeEmbed = (url: string): string | null => {
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/
  );
  return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : null;
};

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product: productData, isLoading, error } = useProduct(slug || '');

  const product = (productData || null) as Product | null;

  const mediaItems = React.useMemo<MediaItem[]>(() => {
    if (!product) return [];
    const items: MediaItem[] = [];

    if (product.videoUrl) {
      const thumb = product.image;
      items.push({ type: 'video', src: product.videoUrl, thumb });
    }

    if (product.image) {
      items.push({ type: 'image', src: product.image, thumb: product.image });
    }

    const gallery: ProductImage[] = Array.isArray(product.images)
      ? product.images
      : [];
    for (const img of gallery) {
      if (img.url) {
        items.push({ type: 'image', src: img.url, thumb: img.url });
      }
    }

    return items;
  }, [product]);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (activeIndex >= mediaItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, mediaItems.length]);

  // Preload adjacent images for smoother nav
  React.useEffect(() => {
    const next = mediaItems[activeIndex + 1];
    const prev = mediaItems[activeIndex - 1];
    if (next?.type === 'image') preloadImage(next.src);
    if (prev?.type === 'image') preloadImage(prev.src);
  }, [activeIndex, mediaItems]);

  const goPrev = React.useCallback(() => {
    if (mediaItems.length === 0) return;
    setActiveIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length);
  }, [mediaItems.length]);

  const goNext = React.useCallback(() => {
    if (mediaItems.length === 0) return;
    setActiveIndex(prev => (prev + 1) % mediaItems.length);
  }, [mediaItems.length]);

  const selectIndex = React.useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const activeItem = mediaItems[activeIndex];

  const renderActiveMedia = React.useCallback(
    (item: MediaItem): React.ReactNode => {
      if (!product) return null;
      if (item.type === 'image') {
        return (
          <img
            src={item.src}
            alt={product.name}
            loading='lazy'
            style={{ width: '100%', height: 360, objectFit: 'cover' }}
          />
        );
      }

      const ytEmbed = getYouTubeEmbed(item.src);
      if (ytEmbed) {
        return (
          <Box sx={{ position: 'relative', pt: '56.25%' }}>
            <iframe
              src={ytEmbed}
              title={product.name}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </Box>
        );
      }

      if (isDirectVideo(item.src)) {
        return (
          <video
            src={item.src}
            controls
            style={{
              width: '100%',
              height: 360,
              objectFit: 'cover',
              background: '#000',
            }}
          />
        );
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 360,
            bgcolor: 'grey.100',
          }}
        >
          <Stack alignItems='center' spacing={1}>
            <PlayArrow color='action' />
            <Typography variant='body2'>
              <a href={item.src} target='_blank' rel='noopener noreferrer'>
                Open video
              </a>
            </Typography>
          </Stack>
        </Box>
      );
    },
    [product]
  );

  // Window thumbnails for performance
  const thumbWindow = React.useMemo(() => {
    const windowSize = 12;
    const start = Math.max(0, activeIndex - Math.floor(windowSize / 2));
    const end = Math.min(mediaItems.length, start + windowSize);
    return mediaItems
      .slice(start, end)
      .map((item, idx) => ({ item, realIndex: start + idx }));
  }, [activeIndex, mediaItems]);

  const content = React.useMemo(() => {
    if (isLoading) {
      return <LoadingBase />;
    }

    if (error || !product) {
      return (
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-red-600'>
            Product not found or error loading product.
          </div>
        </div>
      );
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <MetaTitleBase
          title={SEO_META.PUBLIC.PRODUCT_DETAIL.TITLE}
          description={SEO_META.PUBLIC.PRODUCT_DETAIL.DESCRIPTION}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
          }}
        >
          <Box>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                position: 'relative',
              }}
            >
              {mediaItems.length > 1 && (
                <>
                  <Tooltip title='Previous'>
                    <IconButton
                      onClick={goPrev}
                      size='small'
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 8,
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'white',
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Next'>
                    <IconButton
                      onClick={goNext}
                      size='small'
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 8,
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'white',
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {activeItem && renderActiveMedia(activeItem)}
            </Box>

            {mediaItems.length > 1 && (
              <Box sx={{ mt: 2 }}>
                <ImageList cols={4} gap={8}>
                  {thumbWindow.map(({ item, realIndex }) => (
                    <ImageListItem
                      key={`${item.type}-${realIndex}`}
                      onClick={() => selectIndex(realIndex)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={item.thumb}
                        alt={`${product.name} ${realIndex + 1}`}
                        loading='lazy'
                        style={{
                          width: '100%',
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 8,
                          outline:
                            activeIndex === realIndex
                              ? '2px solid #1976d2'
                              : 'none',
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant='h4' fontWeight={700} gutterBottom>
              {product.name}
            </Typography>
            <Stack direction='row' spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {product.category?.name && (
                <Chip
                  label={product.category.name}
                  color='primary'
                  variant='outlined'
                />
              )}
              <Chip label={`${product.views} views`} variant='outlined' />
            </Stack>

            <Typography
              variant='h5'
              color='primary'
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              ${product.price}
            </Typography>

            {product.techStacks && product.techStacks.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Built with
                </Typography>
                <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {product.techStacks.map(ts => (
                    <Chip key={ts.id} label={ts.name} variant='outlined' />
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ whiteSpace: 'pre-line' }}
            >
              {product.description}
            </Typography>

            <Stack direction='row' spacing={2} sx={{ mt: 4 }}>
              <ButtonBase variant='primary' size='lg'>
                Add to Cart
              </ButtonBase>
              <ButtonBase variant='outline' size='lg'>
                Buy Now
              </ButtonBase>
            </Stack>
          </Box>
        </Box>
      </div>
    );
  }, [
    isLoading,
    error,
    product,
    mediaItems,
    activeItem,
    goPrev,
    goNext,
    renderActiveMedia,
    selectIndex,
    activeIndex,
    thumbWindow,
  ]);

  return <UserLayout>{content}</UserLayout>;
};

export default ProductDetailPage;
