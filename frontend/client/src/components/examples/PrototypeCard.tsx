import PrototypeCard from '../PrototypeCard';
import cityImage from "@assets/generated_images/City_blocks_satellite_view_a7aa93d2.png";

export default function PrototypeCardExample() {
  return (
    <div className="max-w-sm">
      <PrototypeCard
        image={cityImage}
        title="Upload image"
        testId="card-prototype"
      />
    </div>
  );
}
