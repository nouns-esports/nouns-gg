import LinkEmailModal from "@/components/modals/LinkEmailModal";
import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect } from "next/navigation";
import Checkout from "@/components/Checkout";
import { Country, State } from "country-state-city";

export default async function CheckoutPage() {
	const user = await getAuthenticatedUser();

	if (!user?.nexus || user.nexus.carts.length === 0) {
		return redirect("/shop");
	}

	return (
		<>
			<div className="flex max-lg:flex-col-reverse max-lg:items-center justify-center gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<Checkout
					user={user}
					countries={Country.getAllCountries().map((country) => ({
						name: country.name,
						code: country.isoCode,
						provinces: State.getStatesOfCountry(country.isoCode).map(
							(state) => ({
								name: state.name,
								code: state.isoCode,
							}),
						),
					}))}
				/>
			</div>
			{!user.email?.address ? <LinkEmailModal hasEmail={false} /> : null}
		</>
	);
}
