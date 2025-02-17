"use client";

import { useEffect, useMemo, useState } from "react";
import TextInput from "./form/TextInput";
import { ToggleModal } from "./Modal";
import { Asterisk, Check, ChevronDown, Link } from "lucide-react";
import type { AuthenticatedUser } from "@/server/queries/users";
import ReactSlider from "react-slider";
import { twMerge } from "tailwind-merge";
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { estimateOrderCost } from "@/server/queries/shop";
import { useDebounce } from "@uidotdev/usehooks";
import { useAction } from "next-safe-action/hooks";
import { createDraftOrder } from "@/server/mutations/createDraftOrder";
import { useRouter } from "next/navigation";

export default function Checkout(props: {
	user: AuthenticatedUser;
	countries: Array<{
		code: string;
		name: string;
		provinces: Array<{
			code: string;
			name: string;
		}>;
	}>;
}) {
	if (!props.user.nexus) {
		throw new Error("User has no nexus");
	}

	const subtotal = props.user.nexus.carts.reduce((acc, item) => {
		const variant = item.product.variants.find(
			(variant) => variant.shopifyId === item.variant,
		);

		if (!variant) return acc;

		return acc + Number(variant.price) * item.quantity;
	}, 0);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [zip, setZip] = useState("");
	const [country, setCountry] = useState("");

	const [countryQuery, setCountryQuery] = useState("");
	const [provinceQuery, setProvinceQuery] = useState("");

	const [goldUsed, setGoldUsed] = useState(0);

	const validShippingAddress = useMemo(() => {
		return (
			lastName.length > 0 &&
			address1.length > 0 &&
			country.length > 0 &&
			province.length > 0 &&
			city.length > 0 &&
			(!requiresPostalCode.includes(country) || zip.length > 0)
		);
	}, [lastName, address1, city, province, zip, country]);

	const shouldSimulateOrder = useDebounce(
		{
			validShippingAddress,
			nexusExists: !!props.user.nexus,
			cartLength: props.user.nexus?.carts.length ?? 0,
			lastName,
			address1,
			city,
			province,
			country,
			zip,
		},
		1000,
	);

	const { data: simulatedOrder, isLoading } = useQuery({
		queryKey: ["simulatedOrder", shouldSimulateOrder],
		queryFn: async () => {
			if (
				!props.user.nexus ||
				!validShippingAddress ||
				props.user.nexus.carts.length === 0
			) {
				return { tax: 0, shipping: 0 };
			}

			const result = await estimateOrderCost({
				items: props.user.nexus.carts.map((cart) => ({
					variant: cart.variant,
					quantity: cart.quantity,
				})),
				shipping: {
					address1,
					address2,
					city,
					province,
					country,
					zip,
				},
			});

			console.log(result);

			return result;
		},
	});

	const total = useMemo(() => {
		return (
			subtotal + (simulatedOrder?.tax ?? 0) + (simulatedOrder?.shipping ?? 0)
		);
	}, [subtotal, simulatedOrder]);

	const totalWithDiscount = useMemo(() => {
		return total - goldUsed / 100;
	}, [subtotal, simulatedOrder, goldUsed]);

	const canCheckout = useMemo(() => {
		return props.user.email?.address && validShippingAddress;
	}, [props.user.email, validShippingAddress]);

	const createDraftOrderAction = useAction(createDraftOrder);
	const router = useRouter();
	return (
		<>
			<div className="flex flex-col gap-8 bg-grey-800 rounded-xl p-4 h-min max-lg:w-full max-lg:max-w-lg">
				<div className="flex flex-col gap-4 min-w-64">
					<h1 className="text-white text-2xl font-bebas-neue leading-none">
						Your Cart
					</h1>
					<div className="flex flex-col gap-4">
						{props.user.nexus.carts
							.toSorted((a, b) => a.product.name.localeCompare(b.product.name))
							.map((item) => {
								const variant = item.product.variants.find(
									(variant) => variant.shopifyId === item.variant,
								);

								if (!variant) return;

								return (
									<div
										key={item.product.id}
										className="flex items-center gap-4"
									>
										<div className="flex items-center gap-2 bg-grey-600 rounded-lg p-2 w-16 h-16 aspect-square">
											<img
												src={`${item.product.images[0]}?img-height=100&img-onerror=redirect`}
												alt={item.product.name}
												className="w-full h-full object-contain rounded-md"
											/>
										</div>
										<div className="flex flex-col gap-2 w-full">
											<p className="text-white line-clamp-1">
												{item.product.name}
											</p>
											<div className="flex items-center gap-2">
												<p className="text-white">
													${variant.price.toFixed(2)}
												</p>
												<p className="text-grey-200">x{item.quantity}</p>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						{simulatedOrder?.tax && simulatedOrder.tax > 0 ? (
							<div className="flex justify-between items-center">
								<p className="text-sm">Tax</p>
								<p className="text-sm">${simulatedOrder.tax.toFixed(2)}</p>
							</div>
						) : null}
						{simulatedOrder?.shipping && simulatedOrder.shipping > 0 ? (
							<div className="flex justify-between items-center">
								<p className="text-sm">Shipping</p>
								<p className="text-sm">${simulatedOrder.shipping.toFixed(2)}</p>
							</div>
						) : null}
						{goldUsed > 0 ? (
							<div className="flex justify-between items-center">
								<p className="text-sm text-gold-500">Gold Used</p>
								<p className="text-sm text-gold-500">-${goldUsed / 100}</p>
							</div>
						) : null}
					</div>
					<div className="flex justify-between items-center">
						<p className="text-white text-xl font-bebas-neue leading-none">
							Total
						</p>

						<div className="flex gap-2.5 items-center">
							{goldUsed > 0 ? (
								<p className="line-through text-xl font-bebas-neue leading-none">
									${total.toFixed(2)}
								</p>
							) : null}
							<p className="text-white text-xl font-bebas-neue leading-none">
								${totalWithDiscount.toFixed(2)}
							</p>
						</div>
					</div>
					<button
						disabled={
							!canCheckout ||
							isLoading ||
							!simulatedOrder ||
							createDraftOrderAction.isPending ||
							!props.user.email?.address
						}
						onClick={async () => {
							if (
								!canCheckout ||
								isLoading ||
								!simulatedOrder ||
								createDraftOrderAction.isPending ||
								!props.user.email?.address
							)
								return;

							const response = await createDraftOrderAction.executeAsync({
								shipping: {
									firstName,
									lastName,
									address1,
									address2,
									city,
									province,
									country,
									zip,
								},
								email: props.user.email.address,
								goldApplied: goldUsed,
							});

							if (response?.data) {
								window.open(response.data, "_blank");
								router.push("/shop");
							}
						}}
						className={twMerge(
							"flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors",
							!canCheckout ||
								isLoading ||
								createDraftOrderAction.isPending ||
								!props.user.email?.address
								? "opacity-50 cursor-not-allowed hover:bg-white"
								: "",
						)}
					>
						{isLoading || createDraftOrderAction.isPending ? (
							<img
								alt="loading spinner"
								src="/spinner.svg"
								className="h-[18px] animate-spin"
							/>
						) : (
							""
						)}
						Complete Order
					</button>
				</div>
			</div>
			<div className="w-full max-w-lg flex flex-col gap-4">
				<div className="w-full flex flex-col gap-4 bg-grey-800 rounded-xl p-4">
					<div className="flex justify-between items-center">
						<h1 className="text-white text-2xl font-bebas-neue leading-none">
							Email
						</h1>
						<p
							className={twMerge(
								"text-sm flex items-center gap-0.5",
								props.user.email?.address ? "text-green" : "text-red",
							)}
						>
							{props.user.email?.address ? (
								<Check className="w-4 h-4" />
							) : (
								<Asterisk className="w-4 h-4" />
							)}
							Required
						</p>
					</div>
					{props.user.email ? (
						<p className="flex items-center gap-1">
							{props.user.email.address}
						</p>
					) : (
						<ToggleModal
							id="link-email"
							className="text-red hover:text-red/70 transition-colors flex items-center gap-1"
						>
							<Link className="w-4 h-4" />
							Link an email
						</ToggleModal>
					)}
				</div>
				<div className=" w-full flex flex-col gap-4 bg-grey-800 rounded-xl p-4">
					<div className="flex justify-between items-center">
						<h1 className="text-white text-2xl font-bebas-neue leading-none">
							Shipping
						</h1>
						<p
							className={twMerge(
								"text-sm flex items-center gap-0.5",
								validShippingAddress ? "text-green" : "text-red",
							)}
						>
							{validShippingAddress ? (
								<Check className="w-4 h-4" />
							) : (
								<Asterisk className="w-4 h-4" />
							)}
							Required
						</p>
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex max-sm:flex-col items-center gap-2">
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="firstName" className="text-white font-lg ">
									First Name
								</label>
								<input
									name="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="Tyler"
									className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
								/>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="lastName" className="text-white font-lg ">
									Last Name
								</label>
								<input
									name="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="Durden"
									className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
								/>
							</div>
						</div>
						<div className="flex max-sm:flex-col items-center gap-2">
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="address" className="text-white font-lg ">
									Address
								</label>
								<input
									name="address"
									type="text"
									value={address1}
									onChange={(e) => setAddress1(e.target.value)}
									placeholder="537 Paper Street"
									className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
								/>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="address2" className="text-white font-lg">
									Apt, Suite, Building
								</label>
								<input
									name="address2"
									type="text"
									value={address2}
									onChange={(e) => setAddress2(e.target.value)}
									placeholder="Apt 1"
									className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
								/>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="country" className="text-white font-lg ">
									Country
								</label>
								<Combobox
									value={country}
									onChange={(value) => setCountry(value ?? "")}
								>
									<div className="relative z-10">
										<ComboboxInput
											name="country"
											placeholder="Select"
											className={twMerge(
												"w-full bg-black/15 rounded-xl text-white py-2 placeholder:text-grey-400 px-3 outline-none border-grey-600 border-[1px]",
												country === "" && "text-grey-400",
											)}
											displayValue={(code: string) =>
												props.countries.find((c) => c.code === code)?.name || ""
											}
											onChange={(e) => setCountryQuery(e.target.value)}
										/>
										<ComboboxButton className="absolute z-50 inset-y-0 right-0 flex items-center pr-2">
											<ChevronDown
												className="h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
										</ComboboxButton>
										<ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border-grey-600 border-[1px] bg-grey-800 shadow-lg custom-scrollbar">
											{props.countries
												.filter((country) =>
													country.name
														.toLowerCase()
														.includes(countryQuery.toLowerCase()),
												)
												.map((country) => (
													<ComboboxOption
														key={country.code}
														value={country.code}
														className={({ active }) =>
															"relative select-none py-2 pl-10 pr-4 hover:bg-grey-600 cursor-pointer"
														}
													>
														{country.name}
													</ComboboxOption>
												))}
										</ComboboxOptions>
									</div>
								</Combobox>
							</div>
							{(
								props.countries.find((c) => c.code === country)?.provinces ?? []
							).length > 0 ? (
								<div className="flex flex-col gap-2 w-full">
									<label htmlFor="province" className="text-white font-lg">
										{country === "" ||
										["US", "AU", "IN", "BR", "MX", "NG"].includes(country)
											? "State"
											: ["CA", "CN", "PK", "ZA", "NL", "TR"].includes(country)
												? "Province"
												: "State/Province/Region"}
									</label>
									<Combobox
										value={province}
										onChange={(value) => setProvince(value ?? "")}
									>
										<div className="relative z-20">
											<ComboboxInput
												name="province"
												disabled={country === ""}
												placeholder={
													country === "" ? "Select a country" : "Select"
												}
												className={twMerge(
													"w-full bg-black/15 rounded-xl text-white py-2 placeholder:text-grey-400 px-3 outline-none border-grey-600 border-[1px]",
													province === "" && "text-grey-400",
												)}
												displayValue={(code: string) =>
													props.countries
														.find((c) => c.code === country)
														?.provinces.find((p) => p.code === code)?.name || ""
												}
												onChange={(e) => setProvinceQuery(e.target.value)}
											/>
											{country !== "" ? (
												<ComboboxButton className="absolute z-50 inset-y-0 right-0 flex items-center pr-2">
													<ChevronDown
														className="h-5 w-5 text-gray-400"
														aria-hidden="true"
													/>
												</ComboboxButton>
											) : null}
											<ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto border-grey-600 border-[1px] rounded-md bg-grey-800 py-1 shadow-lg custom-scrollbar">
												{props.countries
													.find((c) => c.code === country)
													?.provinces.filter((province) =>
														province.name
															.toLowerCase()
															.includes(provinceQuery.toLowerCase()),
													)
													.map((province) => (
														<ComboboxOption
															key={province.code}
															value={province.code}
															className={({ active }) =>
																"relative select-none py-2 pl-10 pr-4 hover:bg-grey-600 cursor-pointer"
															}
														>
															{province.name}
														</ComboboxOption>
													))}
											</ComboboxOptions>
										</div>
									</Combobox>
								</div>
							) : null}
						</div>
						<div className="flex items-center gap-2">
							<div className="flex flex-col gap-2 w-full">
								<label htmlFor="city" className="text-white font-lg">
									City
								</label>
								<input
									name="city"
									type="text"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder="Bradford"
									className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
								/>
							</div>
							{requiresPostalCode.includes(country) ? (
								<div className="flex flex-col gap-2 w-full">
									<label htmlFor="zip" className="text-white font-lg ">
										{country === "US" ? "Zip" : "Postal Code"}
									</label>
									<input
										name="zip"
										type="text"
										value={zip}
										onChange={(e) => setZip(e.target.value)}
										placeholder="19808"
										className="bg-black/15 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px]"
									/>
								</div>
							) : null}
						</div>
					</div>
				</div>
				{total > 0 && props.user.nexus?.gold ? (
					<div className="w-full flex flex-col gap-4 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h1 className="text-white text-2xl font-bebas-neue leading-none">
								Redeem Gold
							</h1>
							<p className="text-sm text-white">
								{goldUsed} /{" "}
								{props.user.nexus.gold >= subtotal * 100
									? subtotal * 100
									: props.user.nexus.gold}
							</p>
						</div>
						<ReactSlider
							className="h-8 flex items-center"
							thumbClassName="h-8 w-8 rounded-full bg-contain bg-no-repeat bg-center cursor-pointer outline-none"
							trackClassName="h-2 rounded-full bg-black/25"
							value={goldUsed}
							onChange={(value) => setGoldUsed(value)}
							min={0}
							max={
								props.user.nexus.gold >= subtotal * 100
									? subtotal * 100
									: props.user.nexus.gold
							}
							renderTrack={(props, state) => (
								<div
									{...props}
									key={props.key}
									className={`${props.className} ${
										state.index === 0 ? "bg-gold-500" : ""
									}`}
								/>
							)}
							renderThumb={(props) => (
								<div
									{...props}
									key={props.key}
									style={{
										...props.style,
										backgroundImage: `url('https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu')`,
									}}
								/>
							)}
						/>
					</div>
				) : null}
			</div>
		</>
	);
}

const requiresPostalCode = [
	"DZ",
	"AR",
	"AM",
	"AU",
	"AT",
	"AZ",
	"A2",
	"BD",
	"BY",
	"BE",
	"BA",
	"BR",
	"BN",
	"BG",
	"CA",
	"IC",
	"CN",
	"CO",
	"HR",
	"CY",
	"CZ",
	"DK",
	"EC",
	"EN",
	"EE",
	"FO",
	"FI",
	"FR",
	"GE",
	"DE",
	"GR",
	"GL",
	"GU",
	"GG",
	"HO",
	"HU",
	"IN",
	"ID",
	"IL",
	"IT",
	"JP",
	"JE",
	"KZ",
	"KR",
	"KO",
	"KG",
	"LV",
	"LI",
	"LT",
	"LU",
	"MK",
	"MG",
	"M3",
	"MY",
	"MH",
	"MQ",
	"YT",
	"MX",
	"MN",
	"ME",
	"NL",
	"NZ",
	"NB",
	"NO",
	"PK",
	"PH",
	"PL",
	"PO",
	"PT",
	"PR",
	"RE",
	"RU",
	"SA",
	"SF",
	"CS",
	"SG",
	"SK",
	"SI",
	"ZA",
	"ES",
	"LK",
	"SX",
	"UV",
	"VL",
	"SE",
	"CH",
	"TW",
	"TJ",
	"TH",
	"TU",
	"TN",
	"TR",
	"TM",
	"VI",
	"UA",
	"GB",
	"US",
	"UY",
	"UZ",
	"VA",
	"VN",
	"WL",
	"YA",
];
