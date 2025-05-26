import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// //istersen metadata ayarla
// export async function generateMetadata({ params }) {
//     const { cabinId } = await params;
//     const { name } = await getCabin(cabinId);
//     return { title: `Cabin ${name}/ ` }
// }

//normalde bu sayfa dinamik render oluyor bunu statik yapmak adına butun idleri alıyoruz
//asagıdaki kod ile idleri bilen next.js statik bi şekilde her id için sayfa olusturuyor
//ve statik renderlıyor serverda
export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));

  return ids;
}

export default async function Page({ params }) {
  const { cabinId } = await params;

  //birden fazla fetch yaptıgımız için hepsi birbirini bekler bunun önlemek için
  const cabin = await getCabin(cabinId);
  /* burada 2 fetch daha vardı mesala  
  const settings = await getSettings()
  const bookedDate = await getBookedDatesByCabinId(cabinId);
   promiseAll kullanmak daha hayırlı  ama bundan daha da iyisini yapabiliriz.
  Dolayısıyla, tüm verileri burada ana sayfada almak yerine, bir dizi farklı bileşen oluşturabilir 
  ve ardından her bir bileşenin ihtiyaç duyduğu tüm verileri almasını sağlayabiliriz 
  ve daha sonra bu bileşenler hazır hale geldikçe içeri aktarılabilir.
  Bunun için Reservation.js oluşturduk
  const [cabin, settings, bookedDate] =  await Promise.all([getCabin(cabinId), getSettings(), getBookedDatesByCabinId(cabinId)])
 */

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
