export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co/storage/v1/render/image/public${src}?width=${width}&quality=${quality || 75}`;
}
