import { Container } from "@/components/layout/container";
import { NotFoundRecord } from "@/components/layout/not-found-record";

/**
 * A missing record inside the public site keeps the site header and footer —
 * only the page area changes, so the shell never stacks two headers.
 */
export default function SiteNotFound() {
  return (
    <Container className="py-16 md:py-24">
      <NotFoundRecord />
    </Container>
  );
}
