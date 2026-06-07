import logo from '../../assets/nuha-logo.png';

export default function NuhaLogo({ className = "h-12 w-auto" }: NuhaLogoProps) {
  return (
    <img
      src={logo}
      alt="Northern Uganda Hoteliers Association"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
