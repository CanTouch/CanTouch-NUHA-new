import logo from '../../assets/nuha-logo.png';

export default function NuhaLogo({ className = "w-10 h-10", iconOnly = false }: NuhaLogoProps) {
  return (
    <img
      src={logo}
      alt="Northern Uganda Hoteliers Association"
      className={className}
    />
  );
}
