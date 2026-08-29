import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../../components/Input";
import Button from "../../components/Button";

const schema = z.object({
  label: z.string().trim().optional(),
  fullName: z.string().trim().min(1, "Full name is required"),
  line1: z.string().trim().min(1, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
  phone: z.string().trim().optional(),
});

function AddressForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <Input id="label" label="Label (optional)" placeholder="Home, Work..." {...register("label")} />
      <Input id="fullName" label="Full name" error={errors.fullName?.message} {...register("fullName")} />
      <Input id="line1" label="Address line 1" error={errors.line1?.message} {...register("line1")} />
      <Input id="line2" label="Address line 2 (optional)" {...register("line2")} />
      <div className="grid grid-cols-2 gap-3">
        <Input id="city" label="City" error={errors.city?.message} {...register("city")} />
        <Input id="state" label="State (optional)" {...register("state")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="postalCode"
          label="Postal code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
        <Input id="country" label="Country" error={errors.country?.message} {...register("country")} />
      </div>
      <Input id="phone" label="Phone (optional)" {...register("phone")} />

      <div className="flex gap-3 mt-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save address"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AddressForm;