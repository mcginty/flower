require 'rubygems'
require 'json'

connections = []
File.open("json/emails.json") do |f|
    incoming = JSON.parse(f.read)
    contacts = {}
    puts "#{incoming.length} emails parsed"

    incoming.each do |email|
        if (email['source'] != "me")
            if contacts.member? email['source']
                contacts[email['source']][:incoming] += 1
            else
                contacts[email['source']] = {
                    :outgoing => 0,
                    :incoming => 1,
                }
            end
        else
            if contacts.member? email['target']
            contacts[email['target']][:outgoing] += 1
            else
                contacts[email['target']] = {
                    :outgoing => 1,
                    :incoming => 0,
                }
            end
        end
    end

    best_ratio = 500
    best_name = "no good ratios"

    contacts.each do |contact,info|
        info[:ratio] = info[:outgoing].to_f / info[:incoming].to_f
        puts "#{contact}: #{info[:ratio]}, #{info[:outgoing]+info[:incoming]} msgs" if info[:ratio] != 0
        if ((info[:ratio]-1).abs < (best_ratio-1).abs)
            best_ratio = info[:ratio]
            best_name = contact
        end
    end
    puts "#{contacts.length} contacts gathered"
    puts "#{best_ratio} is the best ratio, and it's #{best_name}"

end