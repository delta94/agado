interface HotelRoom {
  hotel_id: number;
  room_id: number;
  name: string;
  num_bed: number;
  max_person: number;
  price: number | string;
  total_room: number;
}

export default HotelRoom;
