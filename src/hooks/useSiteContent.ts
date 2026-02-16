import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent(page: string) {
  return useQuery({
    queryKey: ["site_content", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page", page);
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.section] = row.content;
      });
      return map;
    },
  });
}
