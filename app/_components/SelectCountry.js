import { getCountries } from "@/app/_lib/data-service";

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const flag = countries.find((country) => country.name.common === defaultCountry)?.flags.svg ?? "";
  const defaultValue = defaultCountry ? `${defaultCountry}%${flag}` : "";
  return (
    <select
      name={name}
      id={id}
      defaultValue={defaultValue}
      className={className}
    >
      <option value="">Select Country...</option>
      {countries
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .map((c, index) => (
          <option
            key={c.name.common || `country-${index}`}
            value={`${c.name.common}%${c.flags.svg}`}
          >
            {c.name.common}
          </option>
        ))}
    </select>
  );
}

export default SelectCountry;
